export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const db = event.context.cloudflare?.env?.DB
    if (!db) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database binding "DB" is not configured.'
        })
    }
    console.log(db);

    const ps = db.prepare('SELECT * FROM nodes WHERE id = ?').bind(id)
    const data = await ps.first()

    return Response.json(data)
})
