module.exports = {
  '*.{js?(x),ts?(x),css,md}': 'prettier --write',
  '*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
}
