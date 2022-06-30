import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: window.localStorage.getItem('darkTheme') == 'true' ? true : false,
    themes: {
      light: {
        primary: colors.amber.darken1,
        //secondary: colors.amber.lighten4,
        accent: colors.amber.darken1,
      },
      dark: {
        primary: colors.yellow.darken1,
        //secondary: colors.yellow.lighten4,
        accent: colors.yellow.darken1,
      },
    },
    icons: {
      iconfont: 'mdiSvg',
    },
    breakpoint: {
      mobileBreakpoint: 960 // This is equivalent to a value of 960
    },
  },
});
