// scripts/deploy.js

async function main() {
  // We get the contract to deploy
  const AttendanceTracker = await ethers.getContractFactory(
    "AttendanceTracker"
  );
  console.log("Deploying AttendanceTracker...");

  const attendanceTracker = await AttendanceTracker.deploy();

  console.log("AttendanceTracker deployed to:", attendanceTracker.target);

  // Listen for AttendanceMarked event
  attendanceTracker.on("AttendanceMarked", (student, present) => {
    console.log(
      `AttendanceMarked event: Student ${student} is ${
        present ? "present" : "absent"
      }`
    );
  });

  // Listen for StudentAdded event
  attendanceTracker.on("StudentAdded", (student) => {
    console.log(`StudentAdded event: Student ${student} added`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
