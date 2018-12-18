const chalk = require('chalk')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify').uglify
const {
  getOutputFileName,
  handleRollupError,
  handleRollupWarning,
  asyncRimRaf,
  asyncCopyTo,
  asyncReadPackageJson,
  capitalize,
} = require('./utils')

const outputOptions = {
  exports: 'named',
  sourcemap: true,
}

const getBuilds = name => [
  {
    output: {
      format: 'cjs',
    },
    isProduction: false,
  },
  {
    output: {
      format: 'cjs',
    },
    isProduction: true,
    uglify: true,
  },
  {
    output: {
      format: 'cjs',
    },
    isProduction: true,
  },
  {
    output: {
      format: 'esm',
    },
  },
  {
    output: {
      format: 'umd',
      name,
    },
    isProduction: true,
  },
  {
    output: {
      format: 'umd',
      name,
    },
    isProduction: true,
    uglify: true,
  },
]

const newStats = []

function getInputOptions(packageName, options) {
  const inputOptions = {
    input: 'src/index.js',
    treeshake: { pureExternalModules: false },
    onwarn: handleRollupWarning,
  }

  return {
    ...inputOptions,
    ...options.input,
    plugins: [
      babel({
        exclude: '/**/node_modules/**',
        plugins: ['external-helpers'],
      }),
      options.isProduction !== undefined &&
        replace({
          'process.env.NODE_ENV': options.isProduction ? "'production'" : "'development'",
        }),
      resolve(),
      commonjs(),
      options.uglify &&
        uglify({
          mangle: {
            toplevel: true,
          },
        }),
    ].filter(Boolean),
  }
}

async function build(packageName, options) {
  const file = getOutputFileName(packageName, {
    format: options.output.format,
    isProduction: options.isProduction,
    uglify: options.uglify,
  })
  const logFileName = chalk.bold(`${file}`)
  console.log(`${chalk.bgYellow.black(' BUILDING ')} ${logFileName}`)
  try {
    const input = getInputOptions(packageName, options)

    const output = {
      ...outputOptions,
      ...options.output,
      file,
      sourcemap: options.uglify,
    }

    // create a bundle
    const bundle = await rollup.rollup(input)

    // or write the bundle to disk
    await bundle.write(output)
    console.log(`${chalk.bgGreen.black(' FINISHED ')} ${logFileName}`)
  } catch (error) {
    console.log(`${chalk.bgRed.black(' ERROR!!! ')} ${logFileName}`)
    handleRollupError(error)
  }
}

async function buildAll() {
  const pkg = await asyncReadPackageJson()

  await asyncRimRaf('./build')

  const builds = getBuilds(capitalize(pkg.name))
  for (let i = 0; i < builds.length; i++) {
    await build(pkg.name, builds[i])
  }

  await Promise.all([
    asyncCopyTo(`npm`, `../../build/${pkg.name}`),
    // asyncCopyTo('README.md', `../../build/${pkg.name}/README.md`),
    // asyncCopyTo('LICENSE', `../../build/${pkg.name}/LICENSE`),
    asyncCopyTo(`package.json`, `../../build/${pkg.name}/package.json`),
    asyncCopyTo(`src/index.d.ts`, `../../build/${pkg.name}/index.d.ts`),
  ])
}

buildAll()
