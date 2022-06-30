<template>
  <div>
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
    <v-card outlined class="mt-4" :style="$vuetify.breakpoint.mdAndUp ? 'width: fit-content; margin: auto;' : ''">
      <v-card-text class="text-center">
        <img :src="require('../../public/PilotSysMon.svg')" width=250>
        <h4 class="text-h4 mb-2 mt-3">PilotSysMon</h4>
        <h6 class="text-h6">{{ $t('settings.about.version', ['1.1']) }}</h6><br/>
        <p v-html="$t('settings.about.description')"></p><br/>
        <h6 class="text-h6">{{ $t('settings.about.contribsTitle') }}</h6>
        <div class="d-flex align-center mb-2 justify-space-between" v-for="i in contributors" :key="i.name">
          <div class="d-flex align-center">
            <img :src="i.avatar" width=40px height=40px style="border-radius: 50%;">
            <a :href="i.link">
              <span class="text-subtitle-1 ml-3">{{ i.name }}</span>
            </a>
          </div>
          <span class="text-subtitle-2 ml-4">{{ i.description }}</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
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
      },
      contributors: [{name: 'SanyaPilot', link: 'https://github.com/SanyaPilot',
                      avatar: 'https://avatars.githubusercontent.com/u/29630471?v=4',
                      description: this.$t('settings.about.contribs.' + 'SanyaPilot')},
                     {name: 'Ultra119', link: 'https://github.com/Ultra119',
                      avatar: 'https://avatars.githubusercontent.com/u/64977575?v=4',
                      description: this.$t('settings.about.contribs.' + 'Ultra119')},
                     {name: 'tdrkDev', link: 'https://github.com/tdrkDev',
                      avatar: 'https://avatars.githubusercontent.com/u/46124855?v=4',
                      description: this.$t('settings.about.contribs.' + 'tdrkDev')}]
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
        temp.push({text: lang[1].name, value: lang[0]})
      }
      return temp
    }
  }
}
</script>

<style>
</style>
