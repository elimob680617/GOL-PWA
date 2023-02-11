import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import BaseNextAuth, { NextAuthOptions, Session, getServerSession as baseGetServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import pino from 'pino';
import { NextAuthParamOptions } from 'src/@types/next-auth';
import { nextAuthToken } from 'src/next-auth';

const JWT_SECRET = process.env.NEXTAUTH_JWT_SECRET;

export const nextAuthDefaultOptions = (req: any, res: any) => {
  const NEXTAUTH_DEBUG_MODE = String(process.env.NEXTAUTH_DEBUG) === 'true';

  const logger = pino({
    name: 'NEXTAUTH',
    enabled: NEXTAUTH_DEBUG_MODE,
    prettyPrint: { translateTime: 'SYS:standard', ignore: 'pid,hostname,time' },
  });

  const defaultOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        id: 'JWT_SIGN_IN',
        name: 'Sign In',
        credentials: {
          phone: { label: 'Phone', type: 'text' },
          code: { label: 'Verification Code', type: 'text' },
        },
        // @ts-ignore
        async authorize(credentials: SignInCredentials) {
          return await nextAuthToken.create(credentials, req?.headers?.['user-agent']);
        },
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    secret: JWT_SECRET,
    jwt: {
      ...(NEXTAUTH_DEBUG_MODE && {
        encode: (params) => (params?.token ? JSON.stringify(params.token) : ''),
        decode: (params) => JSON.parse(params.token || ""),
      }),
    },
    callbacks: {
      async jwt({ token, user: signInToken, account }) {
        logger.info({ token, account, signInToken }, '[CALLBACKS][JWT][PARAMS]');

        // Signing in
        if (account?.provider === 'JWT_SIGN_IN' && signInToken?.access_token) {
          return signInToken;
        }

        //FIXME: escape refresh scenario for now
        return token;

        // const isValidToken: boolean = await nextAuthToken.validate(token);
        // if (!isValidToken) {
        //   token = (await nextAuthToken.refresh(token)) as any;
        // }

        // token = token?.access_token ? token : null;

        // logger.info(token, '[CALLBACKS][JWT][TOKEN]');

        // return token;
      },
      async session({ session, token }) {
        logger.info({ session, token }, '[CALLBACKS][SESSION][PARAMS]');
        if (token) {
          session.user = { name: (token as any).user.userName };
          session.accessToken = token.access_token;
        } else {
          session.user = { name: "" };
          session.accessToken = ""
        }
        logger.info({ session, token }, '[CALLBACKS][SESSION][FULLFILLED]');
        return session;
      },
    },
    pages: { signIn: '/' },
    debug: NEXTAUTH_DEBUG_MODE,
    events: {
      async signOut({ token }) {
        // await nextAuthToken.revoke(token as any);
        logger.info(token, '[EVENT][SIGN_OUT]');
      },
    },
    logger: {
      error(code, metadata) {
        logger.error(code, metadata, '[LOGGER][ERROR]');
      },
      warn(code) {
        logger.warn(code, '[LOGGER][WARN]');
      },
      debug(code, metadata) {
        logger.debug(code, metadata, '[LOGGER][DEBUG]');
      },
    },
  };
  return defaultOptions;
};

const NextAuth = (req: NextApiRequest, res: NextApiResponse, options?: NextAuthParamOptions) => {
  const defaultOptions = nextAuthDefaultOptions(req, res);
  if (typeof options === 'function') {
    options = options(defaultOptions);
  } else {
    options = options || {};
  }
  return BaseNextAuth(req, res, { ...defaultOptions, ...options });
};

export default NextAuth;

export const getServerSession = async (context: GetServerSidePropsContext): Promise<Session | null> =>
  baseGetServerSession(context, nextAuthDefaultOptions(context.req, context.res));
