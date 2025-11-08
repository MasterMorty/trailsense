import {getServerSession} from '#auth'
import strava from "strava-v3";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session) {
    throw createError({statusCode: 401, statusMessage: 'Unauthenticated'})
  }

  // @ts-ignore
  const stravaAccessToken = session.accessToken

  if (!stravaAccessToken) {
    throw createError({statusCode: 401, statusMessage: 'No Strava token in session'})
  }

  const query = getQuery(event)
  const bounds = query.bounds
  const activity_type = query.activity_type || 'riding'

  if (!bounds) {
    throw createError({statusCode: 400, statusMessage: 'Missing bounds parameter'})
  }

  try {
    strava.config({
      access_token: stravaAccessToken,
      client_id: process.env.AUTH_STRAVA_CLIENT_ID as string,
      client_secret: process.env.AUTH_STRAVA_CLIENT_SECRET as string,
      redirect_uri: ""
    })

    return await strava.segments.explore({
      bounds: bounds,
      activity_type: activity_type
    })

  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Failed to fetch from Strava'
    })
  }
})