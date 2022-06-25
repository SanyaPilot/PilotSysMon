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
        <v-list-item-action class="ml-0" :style="$vuetify.breakpoint.xs ? 'width: 100%;' : ''">
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
      }
    }
  },
  methods: {
    updateLocale() {
      window.localStorage.setItem('lang', this.lang.selected)
      document.location.reload()
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
