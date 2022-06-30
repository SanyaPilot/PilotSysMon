<template>
  <v-app>
    <v-app-bar
      color="primary"
      app
      clipped-left
    >
      <v-app-bar-nav-icon
        @click="triggerDrawer()"
        :class="$vuetify.theme.isDark ? 'black--text' : ''"
      ></v-app-bar-nav-icon>
      <v-scroll-x-reverse-transition origin="center center">
        <v-toolbar-title v-show="titleShown" :class="$vuetify.theme.isDark ? 'black--text' : ''">{{ headers[drawer.selectedItem] }}</v-toolbar-title>
      </v-scroll-x-reverse-transition>
    </v-app-bar>

    <v-navigation-drawer
      app
      clipped
      v-model="drawer.shown"
      :mini-variant="!drawer.expanded"
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="drawer.tempSelectedItem"
          color="accent"
          mandatory
        >
          <v-list-item
            v-for="(item, i) in drawer.items"
            :key="i"
            @click.stop="changeMainView(item.view)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-scroll-x-reverse-transition>
        <v-container fluid v-show="mainViewShown">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </v-container>
      </v-scroll-x-reverse-transition>
    </v-main>
  </v-app>
</template>

<script>
import { getHostname } from './API/network.js'

export default {
  name: 'App',

  data: function() {
    return {
      count: 0,
      drawer: {
        expanded: true,
        shown: false,
        selectedItem: 0,
        tempSelectedItem: 0,
        items: [
          { text: this.$t('ui.items.system'), icon: 'mdi-folder', view: 'sysinfo' },
          { text: this.$t('ui.items.cpu'), icon: 'mdi-cpu-64-bit', view: 'cpu' },
          { text: this.$t('ui.items.disks'), icon: 'mdi-database', view: 'disks'},
          { text: this.$t('ui.items.memory'), icon: 'mdi-memory', view: 'memory' },
          { text: this.$t('ui.items.network'), icon: 'mdi-server-network', view: 'network' },
          { text: this.$t('ui.items.logs'), icon: 'mdi-bug', view: 'logs' },
          { text: this.$t('ui.items.settings'), icon: 'mdi-cog', view: 'settings' }
        ]
      },
      headers: [
        this.$t('ui.headers.system'),
        this.$t('ui.headers.cpu'),
        this.$t('ui.headers.disks'),
        this.$t('ui.headers.memory'),
        null,
        this.$t('ui.headers.logs'),
        this.$t('ui.headers.settings')
      ],
      titleShown: false,
      mainViewShown: false
    }
  },
  methods: {
    changeMainView(view) {
      this.titleShown = false
      this.mainViewShown = false

      setTimeout(function() {
        this.mainViewShown = true
        this.$router.push(view)
      }.bind(this), 400)

      setTimeout(function() {
        this.drawer.selectedItem = this.drawer.tempSelectedItem
        this.titleShown = true
      }.bind(this), 400)
    },
    getSelectedItem() {
      this.drawer.selectedItem = this.drawer.items.findIndex(e => e.view == this.$route.name)
      this.drawer.tempSelectedItem = this.drawer.selectedItem
    },
    triggerDrawer() {
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer.shown = !this.drawer.shown
      } else {
        this.drawer.expanded = !this.drawer.expanded
      }
    }
  },
  async created () {
    this.getSelectedItem()
    this.headers[4] = this.$t('ui.headers.network', [await getHostname()])
  },
  mounted () {
    this.drawer.shown = this.$vuetify.breakpoint.mobile ? false : true
    this.titleShown = true
    this.mainViewShown = true
  }
};
</script>
