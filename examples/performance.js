const map = new Map()

export const put = (key, usage = 1, print = true) => {

    const ent = map.get(key)
    const arr = [...map.values()]
    const old = (arr.length ? arr[arr.length - 1].timeStamp : 0)
    const now = Date.now()
    const dim = now - old
    const use = ent ? ent.use + usage : 1
    map.set(key, { dim, use, timeStamp: now, print })
}

export const gen = () => {

    const table = {}
    const arr = [...map.values()]
    let total = 0
    arr.forEach((i) => {
        if (i.print) {
            total += i.dim
        }
    })
    map.forEach((t, k) => {
        if (t.print) {
            table[k] = {
                "time (ms)": t.dim,
                "percentage": (t.dim / total) * 100,
                "usage": t.use
            }
        }
    })
    return { table, total }
}