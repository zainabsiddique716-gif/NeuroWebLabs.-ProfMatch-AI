// scripts/test-pipeline.js
const { executeInstitutionPipeline } = require('../src/lib/institution-pipeline.ts');

async function runTest(testName, countryCode, universityInput, topics, customInterest) {
  console.log(`\n======================================================`);
  console.log(`RUNNING ${testName}`);
  console.log(`Country: ${countryCode} | University: ${universityInput} | Topics: ${topics.join(', ')}`);
  console.log(`======================================================`);

  try {
    const result = await executeInstitutionPipeline({
      countryCode,
      universityInput,
      selectedTopics: topics,
      customInterest,
    });

    console.log(`DEBUG INFO:`);
    console.log(`  Resolved Inst Name:  ${result.debugInfo.resolvedInstitutionName}`);
    console.log(`  Resolved Inst ID:    ${result.debugInfo.resolvedInstitutionId || 'Country-Scoped'}`);
    console.log(`  OpenAlex Works Found:${result.debugInfo.openAlexWorksFound}`);
    console.log(`  Authors Extracted:   ${result.debugInfo.authorsExtracted}`);
    console.log(`  Faculty Verified:    ${result.debugInfo.facultyVerified}`);
    console.log(`  Final Candidates:    ${result.professors.length}`);

    if (result.professors.length > 0) {
      console.log(`\nTOP 3 DISCOVERED RESEARCHERS:`);
      result.professors.slice(0, 3).forEach((p, idx) => {
        console.log(`  [${idx + 1}] ${p.name} — ${p.university} (${p.country})`);
        console.log(`      Paper: "${p.recentPublications[0]?.title || 'N/A'}"`);
      });
    } else {
      console.log(`  WARNING: 0 candidates returned!`);
    }
  } catch (err) {
    console.error(`  ERROR executing ${testName}:`, err);
  }
}

async function runAllTests() {
  await runTest('TEST A (Pakistan + AI + Computer Vision)', 'PK', 'all', ['Artificial Intelligence', 'Computer Vision'], 'Computer Vision');
  await runTest('TEST B (Pakistan + Machine Learning + NUST)', 'PK', 'NUST', ['Machine Learning'], '');
  await runTest('TEST C (India + AI + IIT Bombay)', 'IN', 'IIT Bombay', ['Artificial Intelligence'], '');
  await runTest('TEST D (Singapore + Computer Science + NUS)', 'SG', 'NUS', ['Computer Science'], '');
  await runTest('TEST E (South Korea + AI + KAIST)', 'KR', 'KAIST', ['Artificial Intelligence'], '');
  await runTest('TEST F (Japan + Robotics + U-Tokyo)', 'JP', 'University of Tokyo', ['Robotics Engineering'], '');
  await runTest('TEST G (China + Computer Vision + Tsinghua)', 'CN', 'Tsinghua University', ['Computer Vision'], '');
}

runAllTests();
