<template>
  <v-card outlined :style="$vuetify.breakpoint.mdAndUp ? 'width: 60%; margin: auto;' : ''">
    <v-list
      subheader
      class="pb-0"
    >
      <v-list-item class="flex-wrap">
        <v-list-item-content style="flex: 1 0 auto;">
          <v-list-item-title>{{ $t('settings.language.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('settings.language.subtitle') }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="ml-0" :style="$vuetify.breakpoint.xs ? 'width: 100%;' : 'width: 180px;'">
          <v-select
            :label="$t('settings.language.hint')"
            v-model="lang.selected"
            :items="langItems"
            hide-details="true"
            @change="updateLocale()"
            :menu-props="{ offsetX: true }"
          ></v-select>
        </v-list-item-action>
      </v-list-item>
      <v-list-item class="flex-wrap">
        <v-list-item-content style="flex: 1 0 auto;">
          <v-list-item-title>{{ $t('settings.theme.title') }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('settings.theme.subtitle') }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="ml-0" :style="$vuetify.breakpoint.xs ? 'width: 100%;' : 'width: 180px;'">
          <v-select
            :label="$t('settings.theme.hint')"
            v-model="theme.selected"
            :items="theme.options"
            hide-details="true"
            @change="updateTheme()"
            :menu-props="{ offsetX: true }"
          ></v-select>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'SettingsPanel',

  data: function() {
    return {
      lang: {
        selected: this.$i18n.locale
      },
      theme: {
        selected: this.$vuetify.theme.dark,
        options: [{text: this.$t('settings.theme.light'), value: false},
                  {text: this.$t('settings.theme.dark'), value: true}]
      }
    }
  },
  methods: {
    updateLocale() {
      window.localStorage.setItem('lang', this.lang.selected)
      document.location.reload()
    },
    updateTheme() {
      window.localStorage.setItem('darkTheme', this.theme.selected)
      this.$vuetify.theme.dark = this.theme.selected
      window.Chart.defaults.global.defaultFontColor = this.$vuetify.theme.isDark ? '#fff' : '#666';
    }
  },
  computed: {
    langItems() {
      let temp = []
      for (const lang of Object.entries(this.$i18n.messages)) {
        console.log(lang)
        temp.push({text: lang[1].name, value: lang[0]})
      }
      return temp
    }
  }
}
</script>

<style>
</style>
