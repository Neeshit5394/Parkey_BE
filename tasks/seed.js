const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const tasks = data.tasks;


async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const task1 = await tasks.addTask('Do Homework for Web-Dev','This is Task 1',4, True);
  const task2 = await tasks.addTask('Register for CS554','This is Task 2',2, False);
  const task3 = await tasks.addTask('Feed Perry','This is task 3',3, True);
  const task4 = await tasks.addTask('Guitar session','This is task 4',1, True);
  const task5 = await tasks.addTask('Hit the grind','This is task 5',1, True);
  console.log("Done seeding database");
  await db.serverConfig.close();
}

main();
