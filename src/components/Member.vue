<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})

const $q = useQuasar()

// 상위 컴포넌트 or 페이지의 이벤트 리스너를 정의해 줍니다.
const emit = defineEmits(['upsert', 'remove'])

// 컴포넌트 내부에서 사용할 멤버 데이터
const _name = ref(props.data.name)
const _team = ref(props.data.team)
const _contact = ref(props.data.contact)

const loading = ref(false)
const editable = ref(false)

// 완료 시 수정 모드를 비활성화
const done = () => {
  loading.value = false
  editable.value = false
}

// 삭제 시 Quasar 알림 플러그인 호출
const remove = () => {
  $q.notify({
    progress: true,
    message: '해당 멤버 카드를 삭제할까요?',
    color: 'indigo-5',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'negative',
        handler: () => {
          loading.value = false
          emit('remove', props.data.mid)
        }
      },
      { label: '취소', color: 'white' }
    ]
  })
}

// 취소 시 기존 데이터로 되돌림
const cancel = () => {
  _name.value = props.data.name
  _team.value = props.data.team
  _contact.value = props.data.contact
  editable.value = false
}

// 데이터를 수정 또는 입력 (현재 멤버 데이터를 상위 컴포넌트 or 페이지에 전달)
const upsert = () => {
  loading.value = true

  // 로딩 바를 확인하기 위해 setTimeout 으로 2초를 지연
  emit(
    'upsert',
    {
      mid: props.data.mid,
      name: _name.value,
      team: _team.value,
      contact: _contact.value
    },
    done
  )
}
</script>

<template>
  <q-card class="overflow-hidden">
    <!-- Quasar Inner Loading 컴포넌트를 사용해 로딩 상태를 표시 -->
    <q-inner-loading :showing="loading" style="z-index: 1">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
    <div class="q-pa-sm bg-primary">
      <div class="row justify-between">
        <div class="row items-center q-gutter-x-xs">
          <!-- 수정 모드에서만 멤버 카드 삭제 버튼을 노출 -->
          <q-btn
            v-if="editable"
            dense
            flat
            round
            size="sm"
            color="negative"
            icon="playlist_remove"
            @click="remove"
          />
          <div class="text-center text-white">멤버</div>
        </div>
        <div>
          <!--  -->
          <q-btn
            v-if="!editable"
            unelevated
            dense
            round
            flat
            size="sm"
            color="white"
            icon="edit"
            @click="editable = true"
          />
          <template v-else>
            <q-btn
              unelevated
              dense
              round
              flat
              size="sm"
              color="white"
              icon="close"
              @click="cancel"
            />
            <q-btn unelevated dense round size="sm" color="positive" icon="check" @click="upsert" />
          </template>
        </div>
      </div>
    </div>
    <q-card-section>
      <q-input v-model="_name" :readonly="!editable" dense :borderless="!editable" />
      <q-input v-model="_team" :readonly="!editable" dense :borderless="!editable" />
      <q-input v-model="_contact" :readonly="!editable" dense :borderless="!editable" />
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
