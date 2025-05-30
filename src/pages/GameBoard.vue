<template>
  <div>
    <app-bar
      @show-instructions="showInstructions = true"
      @show-settings="showSettings = true"
    />

    <InstructionsDialog v-model="showInstructions" />
    <SettingsDialog 
      v-model="showSettings"
      :initialNumCategories="inputs.length"
      :initialNumOptions="optionsPerCategory"
      :initialCategories="categoryNames"
      @save-settings="updateSettings"
      @complete="handlePromptComplete"
    />

    <InitialPromptDialog
      v-model="showInitialDialog"
      :categories="categoryNames.slice(1)"
      @category-submitted="handleCategorySubmission"
      @submit-and-generate="submitForm"
    />

    <GenerateNumberDialog
      v-model="showGenerateDialog"
      @confirmed="handleGenerateConfirmed"
    />

    <v-form @submit.prevent="submitForm">
      <v-row dense class="justify-space-between">
        <v-col
          v-for="(category, index) in inputs"
          :key="index"
          cols="12"
          sm="6"
          md="2"
          class="category-box"
        >
          <CategoryInput
            v-model="category.options"
            :title="category.name"
            :readonly="gameRunning || category.name === 'MASH'"
            :eliminated="eliminatedOptions[category.name]"
            :winner="finalChoices[category.name]"
            :highlight="highlightedOption?.category === category.name ? highlightedOption.value : null"
          />
        </v-col>
      </v-row>

      <v-btn color="primary" @click="showInitialDialog = true">Start Game</v-btn>

      <div class="magic-number-display text-h4 text-center mb-2" v-if="magicNumberDisplay !== null">
        Magic Number: <strong>{{ magicNumberDisplay }}</strong>
      </div>
    </v-form>

    <v-divider class="my-6" />

    <div class="spinner-container">
      <div v-if="loading" class="animated-text">
        <span
          v-for="(char, index) in animatedMessage"
          :key="index"
          :style="{ color: charColors[index] }"
        >
          {{ char }}
        </span>
      </div>
      <MashStoryDisplay v-else :story="mashStory" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref} from 'vue'
  import InitialPromptDialog from '../components/InitialPromptDialog.vue'
  import AppBar from '../components/AppBar.vue'
  import InstructionsDialog from '../components/InstructionsDialog.vue'
  import SettingsDialog from '../components/SettingsDialog.vue'
  import CategoryInput from '../components/CategoryInput.vue'
  import MashStoryDisplay from '../components/MashStoryDialog.vue'

  import { generatePrompt } from '../utils/useMashStoryPrompt.ts'
  import { generateStory } from '../composables/useOpenAI' 

  import type { CategoryInputData, Result } from '../types';

  const showInstructions = ref(false)
  const showSettings = ref(false)
  const showInitialDialog = ref(false)
  const showGenerateDialog = ref(false)
  const loading = ref(false)


  const gameRunning = ref(false)
  const mashStory = ref<string | null>(null)
  const results = ref<Result[]>([])
  const magicNumber = ref<number>(0)
  const magicNumberDisplay = ref<number | null>(null)
  const finalChoices = ref<Record<string, string>>({})
  const eliminatedOptions = ref<Record<string, Set<string>>>({})
  const highlightedOption = ref<{ category: string; value: string } | null>(null)    
  
  const optionsPerCategory = ref(4)
  const initCategories = ['Spouse', 'Job', 'Car', 'Location']

  const animatedMessage = 'Your story is being generated by AI'.split('')
  const charColors = ref<string[]>([])
  let colorInterval: number

  const randomColor = () => {
    const colors = ['#e91e63', '#9c27b0', '#3f51b5', '#2196f3', '#4caf50', '#ff9800', '#f44336']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const startColorAnimation = () => {
    charColors.value = animatedMessage.map(() => randomColor())
    colorInterval = window.setInterval(() => {
      charColors.value = animatedMessage.map(() => randomColor())
    }, 300)
  }

  const stopColorAnimation = () => {
    clearInterval(colorInterval)
  }  

  const mashCategory = {
    name: 'MASH',
    options: ['Mansion', 'Apartment', 'Shack', 'House']
  }
  const categoryNames = ref<string[]>([mashCategory.name, ...initCategories])

  const inputs = reactive<CategoryInputData[]>([
    mashCategory,
    ...initCategories.map(name => ({
      name,
      options: Array(optionsPerCategory.value).fill('')
    }))
  ])

  const handlePromptComplete = () => {
    showInitialDialog.value = false
    showGenerateDialog.value = true
  }

  const handleGenerateConfirmed = async () => {
    showGenerateDialog.value = false
    await submitForm() // or a new function that includes magic number spin and then submitForm
  }

  const updateSettings = ( settings: { numCategories: number; numOptions: number; categories: string[] }) => {

    categoryNames.value = [mashCategory.name, ...settings.categories]
    inputs.splice(0, inputs.length) 
    inputs.push({
      name: mashCategory.name,
      options: mashCategory.options,
    })

    for (let i = 0; i < settings.numCategories - 1; i++) {
      inputs.push({
        name: settings.categories[i],
        options: Array(settings.numOptions).fill('')
      })
    }
    optionsPerCategory.value = settings.numOptions
    categoryNames.value = inputs.map(cat => cat.name)
  }

  const handleCategorySubmission = (payload: { name: string; options: string[] }) => {
    const category = inputs.find(cat => cat.name === payload.name)
    if (category) {
      category.options = payload.options
    }
  }

  const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const finalChoicesNotCompleted = (map: Map<string, Set<string>>) =>
    Array.from(map.values()).some(set => set.size > 1)

  const animateMagicNumber = async (finalNumber: number) => {

    let interval = 50
    let duration = 2000
    const startTime = Date.now()

    while (Date.now() - startTime < duration) {
      magicNumberDisplay.value = Math.floor(Math.random() * (10 - 3 + 1) + 3)
      await pause(interval)
      interval += 20 // slow down over time
    }
      magicNumberDisplay.value = finalNumber
  }

  const submitForm = async () => {

    gameRunning.value = true
    results.value = []                      // Store final selected options
    finalChoices.value = {}                // Final choice per category
    eliminatedOptions.value = {}           // Track eliminated options per category
    highlightedOption.value = null         // Current option being highlighted

    const finalMagicNumber = Math.floor(Math.random() * (10 - 3 + 1) + 3)
    await animateMagicNumber(finalMagicNumber)
    magicNumber.value = finalMagicNumber
    // magicNumber.value = Math.floor(Math.random() * (10 - 3 + 1) + 3) // Random count between 3 and 10

    console.log(`Random number: ${magicNumber.value}`)


    // Flatten all non-empty options from all categories
    const flattenOptions: { category: string; value: string }[] = []
    for (const cat of inputs) {
      eliminatedOptions.value[cat.name] = new Set()
      for (const val of cat.options) {
        if (val.trim() !== '') {
          flattenOptions.push({ category: cat.name, value: val.trim() })
        }
      }
    }

    // Track eliminated options by index
    const eliminatedSet = new Set<number>()
    // Track remaining options per category                  
    const remainingPerCategory = new Map<string, Set<string>>()      

    // Initialize remaining options map
    inputs.forEach(cat => {
      const clean = new Set(cat.options.map(opt => opt.trim()).filter(opt => opt))
      remainingPerCategory.set(cat.name, clean)
    })

    let index = -1 // Start before the first index
    // Continue until all categories have a final choice
    while (finalChoicesNotCompleted(remainingPerCategory)) {
      let steps = 0

      // Step through options up to the random number
      while (steps < magicNumber.value) {
        index = (index + 1) % flattenOptions.length // Loop over flattened list
        const current = flattenOptions[index]

        // Only step over options not eliminated and not finalized
        if (!eliminatedSet.has(index) && !finalChoices.value[current.category]) {
          highlightedOption.value = { category: current.category, value: current.value } // Highlight current step
          steps++
          console.log(`Stepping: [${steps}] → ${current.category}: "${current.value}"`)
          await pause(600) // Pause for visual effect on each step
        }
      }

      const { category, value } = flattenOptions[index]
       // If category already finalized, skip this elimination
      if (finalChoices.value[category]) continue

      highlightedOption.value = { category, value } // Optional: reinforce highlight before elimination
      await pause(200)                              // Pause before eliminating

      eliminatedSet.add(index)                      // Mark this option as eliminated
      eliminatedOptions.value[category].add(value)
      remainingPerCategory.get(category)?.delete(value)
      highlightedOption.value = null                // Clear highlight

      console.log(`Eliminated "${value}" from ${category}`)

      // Check if only one option is left in this category
      const remaining = [...(remainingPerCategory.get(category) ?? [])]
      if (remaining.length === 1 && !finalChoices.value[category]) {
        const winner = remaining[0]
        finalChoices.value[category] = winner
        results.value.push({ category, choice: winner }) // Store result
        console.log(`Final choice for ${category}: "${winner}"`)
      }

      await pause(600)
    }

    gameRunning.value = false
    console.log("Game Over!")

    if (!gameRunning.value && results.value.length > 0) {
      loading.value = true
      startColorAnimation()
      try {
        const prompt = generatePrompt(results.value)
        mashStory.value = await generateStory(prompt)
      } catch (error: any) {
        mashStory.value = 'Oops! Something went wrong generating your story.'
        console.error('Error generating story:', error.message || error)
      } finally {
        loading.value = false
        stopColorAnimation()
      }
    }
  }
</script>

<style scoped>
  .category-box {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #fafafa;
  }

  .magic-number-display {
    font-family: 'Courier New', Courier, monospace;
    color: #d81ee9;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .animated-text {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin: 2rem auto;
    font-family: 'Courier New', Courier, monospace;
  }
</style>
