const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain',
};

export default themes;

export function getThemeByLevel(level) {
  const themeMap = {
    1: themes.prairie,
    2: themes.desert,
    3: themes.arctic,
    4: themes.mountain,
  };
  return themeMap[level] || themes.prairie;
}
