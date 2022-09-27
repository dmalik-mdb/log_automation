exports = function() {
  // Get a global value (or `undefined` if no value has the specified name)
  const theme = context.values.get("api_public_keyz");
  console.log(theme)     // Output: { red: "#ee1111", blue: "#1111ee" }
};