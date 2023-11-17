import * as esbuild from 'esbuild'

let ctx

try {
    ctx = await esbuild.context({
        entryPoints: ['src/client/index.ts'],
        bundle: true,
        minify: false,
        sourcemap: true,
        outfile: 'public/static/bundle.js',
    })

    await ctx.watch()
    console.log('Watching client...')

    const { host, port } = await ctx.serve({
        servedir: 'public',
        fallback: 'index.html',
    })
    console.log(`Hot refresh at http://${host}:${port}`)
} catch (error) {
    console.error('An error occured', error)
    process.exit(1)
}
