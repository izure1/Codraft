module.exports = {
  projects: [
    {
      root: './packages/canvas', //root of sub project
      package: 'package.json', // It is relative to root property.
      tsconfig: 'tsconfig.json',  // It is relative to root property.
    },
    {
      root: './packages/core', //root of sub project
      package: 'package.json', // It is relative to root property.
      tsconfig: 'tsconfig.json',  // It is relative to root property.
    }
  ]
}