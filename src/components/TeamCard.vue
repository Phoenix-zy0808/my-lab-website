<script setup lang="ts">
import type { TeamMember } from '~/types'

defineProps<{
  member: TeamMember
}>()

// 角色映射
const roleMap: Record<TeamMember['role'], { label: string, color: string }> = {
  professor: { label: '教授', color: 'bg-primary text-white' },
  associate_professor: { label: '副教授', color: 'bg-secondary text-white' },
  postdoc: { label: '博士后', color: 'bg-accent text-white' },
  phd_student: { label: '博士生', color: 'bg-blue-100 text-blue-700' },
  master_student: { label: '硕士生', color: 'bg-green-100 text-green-700' },
  staff: { label: '工作人员', color: 'bg-gray-100 text-gray-700' },
}
</script>

<template>
  <div card class="group">
    <div flex gap-4>
      <!-- 头像区域 -->
      <div flex-shrink-0>
        <div

          text-3xl text-white font-bold rounded-full flex h-24 w-24 shadow-lg items-center justify-center overflow-hidden from-primary to-secondary bg-gradient-to-br
        >
          <OptimizedImage
            v-if="member.avatar"
            :src="member.avatar"
            :alt="member.name"

            h-full w-full object-cover
            @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
          />
          <span v-else>
            {{ member.name.charAt(0) }}
          </span>
        </div>
      </div>

      <!-- 信息区域 -->
      <div flex-1 min-w-0>
        <div mb-2 flex gap-4 items-start justify-between>
          <div>
            <h3 text-lg text-primary font-semibold transition-colors group-hover:text-secondary>
              {{ member.name }}
            </h3>
            <p text-sm text-secondary>
              {{ member.title }}
            </p>
          </div>
          <span
            text-xs
            px-2
            py-1
            rounded
            :class="roleMap[member.role].color"
          >
            {{ roleMap[member.role].label }}
          </span>
        </div>

        <!-- 简介 -->
        <p v-if="member.bio" text-sm text-gray-600 mb-3 line-clamp-2>
          {{ member.bio }}
        </p>

        <!-- 联系方式 -->
        <div text-sm text-gray-500 flex flex-wrap gap-3>
          <a
            v-if="member.email"
            :href="`mailto:${member.email}`"
            class="transition-colors hover:text-primary"

            flex gap-1 items-center
          >
            <div i-carbon-email />
            <span>{{ member.email }}</span>
          </a>
        </div>

        <!-- 研究兴趣 -->
        <div v-if="member.research_interests?.length" mt-3>
          <div flex flex-wrap gap-2>
            <span
              v-for="interest in member.research_interests"
              :key="interest"

              bg="oklch(56% 0.062 207.6)/10"
              text-xs text-primary px-2 py-1 rounded-full
            >
              {{ interest }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
