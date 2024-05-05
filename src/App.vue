<script setup>
import NavbarMain from "@/components/NavbarMain.vue"
import SideMain from "@/components/SideMain.vue"
import FooterMain from "@/components/FooterMain.vue"
import { RouterView } from 'vue-router'
</script>
<template>
  <NavbarMain />
  <div class="w-screen h-screen flex">
    <SideMain />
    <div class="w-full h-full flex justify-center" style="overflow: auto;">
      <router-view />
    </div>
  </div>
  <FooterMain />

</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
