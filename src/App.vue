<template>
  <v-app>
    <v-app-bar
      color="primary"
      app
      clipped-left
    >
      <v-app-bar-nav-icon
        @click="drawer.expanded = !drawer.expanded"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>PilotSysMon</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      app
      clipped
      permanent
      :mini-variant="!drawer.expanded"
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="drawer.selectedItem"
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
      <v-container fluid>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    count: 0,
    drawer: {
      expanded: true,
      selectedItem: 0,
      items: [
        { text: 'System Info', icon: 'mdi-folder', view: 'sysinfo' },
        { text: 'CPU', icon: 'mdi-cpu-64-bit', view: 'cpu' },
      ]
    },
  }),
  methods: {
    changeMainView(view) {
      this.$router.push(view)
    },
    getSelectedItem() {
      this.drawer.selectedItem = this.drawer.items.findIndex(e => e.view == this.$route.name)
    }
  },
  created () {
    this.getSelectedItem()
  },
  mounted () {
    console.log(this.$vuetify.breakpoint)
    console.log(this.$vuetify)
  }
};
</script>
