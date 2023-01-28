declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      ABLY_KEY: string;
      NEXT_PUBLIC_ABLY_KEY: string;
    }
  }
}

export {};
