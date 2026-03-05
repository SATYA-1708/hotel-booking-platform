import "dotenv/config";
import mongoose from "mongoose";

async function main() {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
  const coll = mongoose.connection.db.collection("bookings");

  let totalDeleted = 0;
  for (let round = 1; ; round++) {
    const groups = await coll
      .aggregate([
        { $project: { prefix: { $substrCP: [{ $toString: "$_id" }, 0, 8] } } },
        { $group: { _id: "$prefix", n: { $sum: 1 } } },
        { $match: { n: { $gt: 100 } } },
      ])
      .toArray();

    if (groups.length === 0) {
      console.log(`round ${round}: no bulk groups left.`);
      break;
    }

    const junkPrefixes = groups.map((g) => g._id);
    const junkQuery = {
      $expr: {
        $in: [{ $substrCP: [{ $toString: "$_id" }, 0, 8] }, junkPrefixes],
      },
    };
    const res = await coll.deleteMany(junkQuery);
    totalDeleted += res.deletedCount;
    console.log(`round ${round}: deleted ${res.deletedCount} (remaining ${await coll.countDocuments()})`);
  }

  console.log(`TOTAL deleted: ${totalDeleted}. remaining: ${await coll.countDocuments()}`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
