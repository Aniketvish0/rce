import Docker from 'dockerode';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const docker = new Docker();


const LANGUAGE_IMAGES = {
  javascript: 'node:18-alpine',
  typescript: 'node:18-alpine',
  python: 'python:3.10-alpine',
  java: 'openjdk:17-alpine',
  'c++': 'gcc:11.2.0'
};


const FILE_EXTENSIONS = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  'c++': 'cpp'
};

const EXECUTION_COMMANDS = {
  javascript: (filename: string) => ['node', filename],
  typescript: (filename: string) => ['npx', 'ts-node', filename],
  python: (filename: string) => ['python', filename],
  java: (filename: string) => {
    const className = path.basename(filename, '.java');
    return ['sh', '-c', `javac ${filename} && java ${className}`];
  },
  'c++': (filename: string) => {
    const executableName = path.basename(filename, '.cpp');
    return ['sh', '-c', `g++ -std=c++17 ${filename} -o ${executableName} && ./${executableName}`];
  }
};

interface ExecutionResult {
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compile_error';
  stdout: string;
  stderr: string;
  runtime: number;
  memory: number;
  testCasesPassed?: number;
  totalTestCases?: number;
}

export async function executeCode(
  code: string,
  language: string,
  testCases: string[]
): Promise<ExecutionResult> {
  if (!LANGUAGE_IMAGES[language as keyof typeof LANGUAGE_IMAGES]) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const executionId = uuidv4();
  const containerName = `code-execution-${executionId}`;
  const workDir = '/code';
  const extension = FILE_EXTENSIONS[language as keyof typeof FILE_EXTENSIONS];
  const filename = `solution.${extension}`;
  const testFilename = `test.${extension}`;
  
  let container;
  
  try {
 
    let testFileContent = '';
    
    if (language === 'javascript' || language === 'typescript') {
      testFileContent = `
${code}

// Test cases
const testCases = ${JSON.stringify(testCases)};
let passed = 0;

console.log("\\n🧪 Running test cases:\\n");

for (let i = 0; i < testCases.length; i++) {
  try {
    const testCase = testCases[i];
    const start = performance.now();
    const result = eval(testCase);
    const end = performance.now();
    passed++;
    console.log(\`✅ Test case \${i + 1}: Passed (\${(end - start).toFixed(2)}ms)\`);
  } catch (error) {
    console.error(\`❌ Test case \${i + 1}: Failed\`);
    console.error(\`   Error: \${error.message}\`);
  }
}

console.log(\`\\n📊 Results: \${passed}/\${testCases.length} test cases passed\`);
      `;
    } else if (language === 'python') {
      testFileContent = `
${code}

# Test cases
import time
import traceback

test_cases = ${JSON.stringify(testCases)}
passed = 0

print("\\n🧪 Running test cases:\\n")

for i, test_case in enumerate(test_cases):
    try:
        start = time.time()
        result = eval(test_case)
        end = time.time()
        passed += 1
        print(f"✅ Test case {i + 1}: Passed ({((end - start) * 1000):.2f}ms)")
    except Exception as e:
        print(f"❌ Test case {i + 1}: Failed")
        print(f"   Error: {str(e)}")
        print(traceback.format_exc())

print(f"\\n📊 Results: {passed}/{len(test_cases)} test cases passed")
      `;
    } else if (language === 'java') {
      const classNameMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      if (!classNameMatch) {
        throw new Error('Could not find class name in Java code');
      }
      const className = classNameMatch[1];
      
      filename = `${className}.java`;
      
      testFileContent = `
${code}

// Test runner class
public class TestRunner {
    public static void main(String[] args) {
        String[] testCases = ${JSON.stringify(testCases)};
        int passed = 0;
        
        System.out.println("\\n🧪 Running test cases:\\n");
        
        for (int i = 0; i < testCases.length; i++) {
            try {
                long start = System.currentTimeMillis();
                Object result = ${className}.main(null); // Assuming main returns something
                long end = System.currentTimeMillis();
                passed++;
                System.out.println("✅ Test case " + (i + 1) + ": Passed (" + (end - start) + "ms)");
            } catch (Exception e) {
                System.out.println("❌ Test case " + (i + 1) + ": Failed");
                System.out.println("   Error: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        System.out.println("\\n📊 Results: " + passed + "/" + testCases.length + " test cases passed");
    }
}
      `;
      testFilename = 'TestRunner.java';
    } else if (language === 'c++') {
      testFileContent = `
${code}

// Test runner
#include <iostream>
#include <chrono>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> testCases = ${JSON.stringify(testCases)};
    int passed = 0;
    
    std::cout << "\\n🧪 Running test cases:\\n" << std::endl;
    
    for (size_t i = 0; i < testCases.size(); i++) {
        try {
            auto start = std::chrono::high_resolution_clock::now();
            // Call your solution function here
            // auto result = solution(...);
            auto end = std::chrono::high_resolution_clock::now();
            auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
            
            passed++;
            std::cout << "✅ Test case " << (i + 1) << ": Passed (" << duration << "ms)" << std::endl;
        } catch (const std::exception& e) {
            std::cout << "❌ Test case " << (i + 1) << ": Failed" << std::endl;
            std::cout << "   Error: " << e.what() << std::endl;
        }
    }
    
    std::cout << "\\n📊 Results: " << passed << "/" << testCases.size() << " test cases passed" << std::endl;
    
    return 0;
}
      `;
    }
    
    container = await docker.createContainer({
      Image: LANGUAGE_IMAGES[language as keyof typeof LANGUAGE_IMAGES],
      name: containerName,
      Cmd: ['sleep', '10'], 
      WorkingDir: workDir,
      HostConfig: {
        Memory: 256 * 1024 * 1024, // 256MB memory limit
        MemorySwap: 256 * 1024 * 1024, // Disable swap
        CpuPeriod: 100000,
        CpuQuota: 50000, // 0.5 CPU
        NetworkMode: 'none', // Disable network
      },
      Tty: true,
    });
    
    await container.start();
    
    // Create code file inside container
    const codeBuffer = Buffer.from(code);
    const testBuffer = Buffer.from(testFileContent);
    
    // Upload files to the container
    await container.putArchive(
      createTarArchive({
        [filename]: codeBuffer,
        [testFilename]: testBuffer,
      }),
      { path: workDir }
    );
    
    // Execute the code
    const startTime = Date.now();
    
    const exec = await container.exec({
      Cmd: EXECUTION_COMMANDS[language as keyof typeof EXECUTION_COMMANDS](testFilename),
      AttachStdout: true,
      AttachStderr: true,
    });
    
    const execStream = await exec.start({});
    
    // Collect stdout and stderr
    let stdout = '';
    let stderr = '';
    
    execStream.on('data', (chunk) => {
      const message = chunk.toString();
      if (message.startsWith('0: ')) {
        stdout += message.slice(3);
      } else if (message.startsWith('1: ')) {
        stderr += message.slice(3);
      } else {
        stdout += message;
      }
    });
    
    // Wait for execution to complete
    await new Promise<void>((resolve) => {
      execStream.on('end', resolve);
    });
    
    const execInspect = await exec.inspect();
    const endTime = Date.now();
    const runtime = endTime - startTime;
    
    // Get memory usage
    const stats = await container.stats({ stream: false });
    const memoryUsage = stats.memory_stats.usage || 0;
    const memoryUsageInKB = Math.round(memoryUsage / 1024);
    
    // Parse test results
    const testCasesPassed = stdout.match(/📊 Results: (\d+)\/(\d+)/);
    const passed = testCasesPassed ? parseInt(testCasesPassed[1]) : 0;
    const total = testCasesPassed ? parseInt(testCasesPassed[2]) : testCases.length;
    
    // Determine execution status
    let status: ExecutionResult['status'] = 'accepted';
    
    if (execInspect.ExitCode !== 0) {
      if (stderr.includes('error TS')) {
        status = 'compile_error';
      } else {
        status = 'runtime_error';
      }
    } else if (passed < total) {
      status = 'wrong_answer';
    } else if (runtime > 5000) { // 5 seconds timeout
      status = 'time_limit_exceeded';
    }
    
    return {
      status,
      stdout,
      stderr,
      runtime,
      memory: memoryUsageInKB,
      testCasesPassed: passed,
      totalTestCases: total,
    };
  } catch (error) {
    console.error('Error executing code:', error);
    return {
      status: 'runtime_error',
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
      runtime: 0,
      memory: 0,
    };
  } finally {
    // Cleanup container
    if (container) {
      try {
        await container.stop();
        await container.remove();
      } catch (error) {
        console.error('Error cleaning up container:', error);
      }
    }
  }
}

// Helper to create a tar archive in memory
function createTarArchive(files: Record<string, Buffer>) {
  const tarHeader = (name: string, size: number) => {
    const header = Buffer.alloc(512);
    Buffer.from(name).copy(header, 0);
    Buffer.from('0000644').copy(header, 100); // File mode
    Buffer.from('0000000').copy(header, 108); // Owner UID
    Buffer.from('0000000').copy(header, 116); // Group UID
    Buffer.from(size.toString(8).padStart(11, '0')).copy(header, 124); // File size
    Buffer.from(Math.floor(Date.now() / 1000).toString(8).padStart(11, '0')).copy(header, 136); // Last modified time
    Buffer.from('0').copy(header, 156, 0, 1); // Type flag (0 = regular file)
    Buffer.from('ustar').copy(header, 257); // UStar indicator
    Buffer.from('00').copy(header, 263); // UStar version
    
    // Calculate checksum
    let checksum = 0;
    for (let i = 0; i < 512; i++) {
      checksum += header[i];
    }
    Buffer.from(checksum.toString(8).padStart(6, '0') + '\0 ').copy(header, 148);
    
    return header;
  };
  
  const buffers: Buffer[] = [];
  
  // Add file entries
  for (const [name, content] of Object.entries(files)) {
    buffers.push(tarHeader(name, content.length));
    buffers.push(content);
    
    // Padding to 512 byte boundary
    const padding = 512 - (content.length % 512 || 512);
    buffers.push(Buffer.alloc(padding));
  }
  
  // End of archive marker
  buffers.push(Buffer.alloc(1024));
  
  return Readable.from(Buffer.concat(buffers));
}