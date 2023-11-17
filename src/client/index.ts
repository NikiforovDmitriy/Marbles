console.log("I's so cool!")

new EventSource('/esbuild').addEventListener('change', () => location.reload())
