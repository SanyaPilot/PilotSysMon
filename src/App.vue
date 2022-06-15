<template>
  <v-app>
    <v-app-bar
      color="primary"
      app
      clipped-left
    >
      <v-app-bar-nav-icon
        @click="triggerDrawer()"
      ></v-app-bar-nav-icon>
      <v-scroll-x-reverse-transition origin="center center">
        <v-toolbar-title v-show="titleShown">{{ headers[drawer.selectedItem] }}</v-toolbar-title>
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
          color="primary"
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

  data: () => ({
    count: 0,
    drawer: {
      expanded: true,
      shown: false,
      selectedItem: 0,
      tempSelectedItem: 0,
      items: [
        { text: 'System Info', icon: 'mdi-folder', view: 'sysinfo' },
        { text: 'CPU', icon: 'mdi-cpu-64-bit', view: 'cpu' },
        { text: 'Disks', icon: 'mdi-database', view: 'disks'},
        { text: 'Memory', icon: 'mdi-memory', view: 'memory' },
        { text: 'Network', icon: 'mdi-server-network', view: 'network' },
        { text: 'Logs', icon: 'mdi-bug', view: 'logs' }
      ]
    },
    headers: [
      'About System',
      'CPU info',
      'Storage devices info',
      'System memory info',
      null,
      'System logs'
    ],
    titleShown: false,
    mainViewShown: false
  }),
  methods: {
    changeMainView(view) {
      this.titleShown = false
      this.mainViewShown = false

      setTimeout(function() {
        this.mainViewShown = true
        this.$router.push(view)
        console.log(view)
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
    this.headers[4] = await getHostname() + ' Interfaces info'
  },
  mounted () {
    this.drawer.shown = this.$vuetify.breakpoint.mobile ? false : true
    console.log(this.$vuetify.breakpoint)
    console.log(this.$vuetify)
    this.titleShown = true
    this.mainViewShown = true
  }
};
</script>
