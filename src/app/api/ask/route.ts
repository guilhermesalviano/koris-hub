import worker from '../../../../worker/src/index';

export async function POST(request: Request) {
  const env = {
    TYPESAFE_API_KEY: process.env.TYPESAFE_API_KEY || '',
    TYPESAFE_API_BASE: process.env.TYPESAFE_API_BASE,
  };
  return worker.fetch(request, env);
}

export async function OPTIONS(request: Request) {
  const env = {
    TYPESAFE_API_KEY: process.env.TYPESAFE_API_KEY || '',
    TYPESAFE_API_BASE: process.env.TYPESAFE_API_BASE,
  };
  return worker.fetch(request, env);
}
