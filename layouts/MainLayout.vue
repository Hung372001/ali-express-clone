<script setup>
import {useUserStore} from "~/stores/user";
const userStore = useUserStore()
const client = useSupabaseClient()
const user = useSupabaseUser()
let isAccountMenu = ref(false)
let isCartHover = ref(false)
let searchItem = ref('')
let isSearching = ref(false)
let items = ref('')
const searchByName = useDebounce(
    async ()=>{
      isSearching.value = true
      items.value = await useFetch(`/api/prisma/search-by-name/${searchItem.value}`)
      isSearching.value = false
    },100
)
watch(()=>searchItem.value,async ()=>{
  if(!searchItem.value){
    setTimeout(()=>{
      items.value =''
      isSearching.value = false
      return
    },500)
  }
  searchByName()
})
</script>

<template>
  <div class="w-full fixed z-50">
    <div id="TopMenu" class="w-full bg-[#FAFAFA] border-b md:block hidden">
      <uL
          class="
           mx-auto
                    flex
                    items-center
                    justify-end
                    text-xs
                    text-[#333333]
                    font-light
                    px-2
                    h-10
                    bg-[#FAFAFA]
                    max-w-[1200px]
                "
      >
        <li class="border-r border-r-gray-400 px-3 hover:text-[#FF4646] cursor-pointer">
          Sell on AliExpress
        </li>
        <li class="border-r border-r-gray-400 px-3 hover:text-[#FF4646] cursor-pointer">
          Cookie Preferences
        </li>
        <li class="border-r border-r-gray-400 px-3 hover:text-[#FF4646] cursor-pointer">
          Help
        </li>
        <li class="border-r border-r-gray-400 px-3 hover:text-[#FF4646] cursor-pointer">
          Buyer Protection
        </li>
        <li class=" px-3 hover:text-[#FF4646] cursor-pointer">
          <Icon name="ic:sharp-install-mobile" size="17"/>
          App
        </li>
        <li
            :class="isAccountMenu ?'bg-white border z-40 shadow-[0_15px_100px_40px_rgba(0,0,0,0.3)]':'border border-[#FAFAFA]'"
            class="relative flex items-center px-2.5 hover:text-[#FF4646] h-full cursor-pointer"
            @mouseenter="isAccountMenu = true"
            @mouseleave="isAccountMenu = false"
        >
          <Icon name="bi:person" size="17"/>
          Account
          <Icon name="ic:sharp-arrow-drop-down" size="17"/>
          <div v-if="isAccountMenu"
               id="AccountMenu"
               class="absolute bg-white w-[220px] text-[#33333] z-40 top-[38px] left-[-100px] border-x border-b"
          >
            <div v-if="!user">
              <div class="font-semibold text-[15px] my-4 px-3">
                Wellcome to AliExpress
              </div>
              <div class="flex items-center gap-1 px-3 mb-3">
                <NuxtLink
                    class="bg-[#FF4646] text-center w-full text-[16px] w-full text-[16px] rounded-sm text-white font-semibold p-2"
                    to="/auth"
                >
                  Login/Register
                </NuxtLink>
              </div>
            </div>
            <div class="border-b">
              <ul>
                <li
                    v-if="user"
                    class="text-[13px] py-2 px-4 w-full hover:bg-gray-200"
                    @click="navigateTo('/orders')"
                >
                  My Orders
                </li>
                <li
                    v-if="user"
                    @click="client.auth.signOut()"
                    class="text-[13px] py-2 px-4 w-full hover:bg-gray-200"
                >
                  SignOut
                </li>
              </ul>
            </div>
          </div>
        </li>
      </uL>
    </div>
    <div
        id="MainHeader"
        class="flex items-center w-full bg-white"
    >
      <div class="flex lg:justify-start justify-between gap-10 max-w-[1150px] w-full px-3 py-5 mx-auto">
        <NuxtLink
            class="min-w-[170px]"
            to="/"
        >
          <img
              src="/AliExpress-logo.png"
              width="170"
          >
        </NuxtLink>
        <div class="max-w-[700px] w-full md:block hidden">
          <div class="relative">
            <div class="flex items-center border-2 border-[#FF4646] rounded-md w-full">
              <input v-model="searchItem" class="w-full place-gray-400 text-sm pl-3 focus:outline-none "
                     placeholder="kitchen accessories" type="text">
              <Icon
                  v-if="isSearching"
                  class="mr-2"
                  name="eos-icons:loading"
                  size="25"
              />
              <button class="flex items-center h-full p-1.5 px-2 bg-[#FF4646]">
                <Icon color='#ffffff' name="ph:magnifying-glass" size="20"/>
              </button>
            </div>
            <div class="absolute bg-white max-w-[700px] h-auto w-full">
              <div
                  v-if="items && items.data"
                  v-for="item in items.data"

                  class="p-1">
                <NuxtLink

                    class="flex items-center justify-between w-full cursor-pointer hover:bg-gray-400"
                    :to="`/item/${item.id}`"
                >
                  <div class="flex  items-center">
                    <img class="rounded-md" :src="item.url" width="40"/>
                    <div class="truncate ml-2">
                      {{item.title}}
                    </div>
                  </div>
                  <div class="truncate">
                    ${{item.price / 100}}
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>

        </div>
        <NuxtLink
            class="flex items-center"
            to="/shoppingcart"
        >
          <button class="relative md:block hidden"
                  @mouseenter="isCartHover = true"
                  @mouseleave="isCartHover = false"
          >
            <span class="absolute flex items-center justify-center right-[-3px] top-0 bg-[#FF4646] h-[17px] min-w-[17px] text-xs text-white px-0.5 rounded-full">
              {{userStore.cart.length}}
            </span>
             <div class="min-w-[40px]">
               <Icon
                   name="ph:shopping-cart-simple-light"
                   size="33"
                   :color="isCartHover?'#FF4646':''"
                 />
             </div>
          </button>
        </NuxtLink>
        <div
        @click="userStore.isMenuOverlay = true"
        class="md:hidden block rounded-full p-1.5 -mt-[4px] hover:bg-gray-200"
        >
         <Icon name="radix-icons:hamburger-menu" size="33"/>
        </div>
      </div>

    </div>
  </div>
  <Loading v-if="userStore.isLoading"/>
  <div class="lg:pt-[150px] md:pt-[130px] pt-[80px] "/>
  <slot/>
  <Footer v-if="!userStore.isLoading"/>

</template>

<style scoped>

</style>