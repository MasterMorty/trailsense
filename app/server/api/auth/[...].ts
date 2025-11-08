import StravaProvider_Import from 'next-auth/providers/strava'
import {NuxtAuthHandler} from "#auth";

const StravaProvider = (StravaProvider_Import as any).default ?? StravaProvider_Import

const stravaClientId = process.env.AUTH_STRAVA_CLIENT_ID
const stravaClientSecret = process.env.AUTH_STRAVA_CLIENT_SECRET
const authOrigin = process.env.AUTH_ORIGIN

if (!stravaClientId || !stravaClientSecret) {
  throw new Error('Strava client ID or secret is not set in .env')
}


export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,

  providers: [
    StravaProvider({
      clientId: stravaClientId,
      clientSecret: stravaClientSecret,
      authorization: {
        params: {scope: 'read,activity:read_all'}
      },
      origin: authOrigin,
    })
  ],

  callbacks: {
    async jwt({token, account}) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      return token
    },

    async session({session, token}) {
      // @ts-ignore
      session.accessToken = token.accessToken as string
      session.user = {
        email: token.email,
        name: token.name,
        image: token.picture
      }

      return session
    }
  }
})