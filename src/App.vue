<!-- App.vue -->

<script setup>
import { reactive, defineAsyncComponent } from 'vue'
import { uid, useQuasar } from 'quasar'

// $q 객체
const $q = useQuasar()

// 멤버 데이터 초기값을 세션 스토리지에서 가져옵니다.
const members = reactive($q.sessionStorage.getItem('members') || [])

// Member 컴포넌트를 가져옵니다.
const Member = defineAsyncComponent(() => import('./components/Member.vue'))

// Member를 추가하는 메서드
const addMember = () => {
  members.unshift({ mid: uid(), name: '', team: '', contact: '' })
}

// Member 정보를 수정하는 메서드
const upsert = (data, done) => {
  const findMember = members.find((m) => m.mid === data.mid)
  const storageMembers = $q.sessionStorage.getItem('members') || []
  const findStorageMember = storageMembers.find((m) => m.mid === data.mid)

  if (findMember) {
    findMember.name = data.name
    findMember.team = data.team
    findMember.contact = data.contact

    if (findStorageMember) {
      findStorageMember.name = data.name
      findStorageMember.team = data.team
      findStorageMember.contact = data.contact
    } else storageMembers.unshift(findMember)
  }

  $q.sessionStorage.set('members', storageMembers)

  done()
}

// Member 정보를 제거하는 메서드
const remove = (mid) => {
  const findIndex = members.findIndex((m) => m.mid === mid)
  const storageMembers = $q.sessionStorage.getItem('members') || []
  const findStorageIndex = storageMembers.findIndex((m) => m.mid === mid)

  if (findIndex !== -1) {
    members.splice(findIndex, 1)

    if (findStorageIndex !== -1) storageMembers.splice(findStorageIndex, 1)
  }

  $q.sessionStorage.set('members', storageMembers)
}
</script>

<template>
  <div>
    <div class="row justify-end q-pb-sm">
      <q-btn dense icon="add" round color="positive" @click="addMember" />
    </div>
    <div class="row q-col-gutter-lg">
      <div v-for="m in members" :key="m" class="col-6 col-md-4">
        <Member :data="m" @upsert="upsert" @remove="remove" />
      </div>
    </div>
    <Info>
      <p><b>Member 데이터</b></p>
      <p>
        {{ members }}
      </p>
    </Info>
  </div>
</template>
