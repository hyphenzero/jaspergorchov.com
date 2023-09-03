module.exports = {
  singleQuote: true,
	semi: false,
	trailingComma: "all",
	plugins: [
		require('prettier-plugin-tailwindcss'),
		require('@trivago/prettier-plugin-sort-imports'),
	],
	"importOrder": ["^(react|next.*)$", "<THIRD_PARTY_MODULES>", "^(@/|./|src/)"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}