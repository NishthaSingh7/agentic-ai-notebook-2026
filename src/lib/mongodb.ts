import { MongoClient, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connect(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error("Missing MONGODB_URI environment variable."));
  }

  const client = new MongoClient(uri, options);
  return client.connect();
}

function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect();
  }
  return global._mongoClientPromise;
}

const clientPromise = {
  then<TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return getClientPromise().then(onfulfilled, onrejected);
  },
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ) {
    return getClientPromise().catch(onrejected);
  },
  finally(onfinally?: (() => void) | null) {
    return getClientPromise().finally(onfinally);
  },
} as Promise<MongoClient>;

export default clientPromise;

export function getDbName() {
  return process.env.MONGODB_DB_NAME ?? "agentic-ai-notebook";
}
