export {
  incrementTP,
  selectClass,
  openSectionModal,
  closeModal,
  waitForModal,
  waitForModalToClose,
  getCurrentTPValue,
  waitForTPValue,
  addAbility,
  addEquipment,
  selectAbilityByTPCost,
  expandAllAbilities,
} from './userInteractions'

// Reference data helpers - imported directly from utils
export {
  getCoreClasses,
  getHybridClasses,
  getAdvancedClasses,
  findClass,
  findCoreClass,
  findHybridClass,
  findAdvancedClass,
  getChassis,
  getChassisWithPatterns,
  getCrawlers,
  getCrawlerBays,
  getAbilities,
  getAbilitiesForClass,
  getAbilitiesByLevel,
  getEquipment,
  getAllClasses,
  findClassById,
  getClassNameById,
} from '../../utils/referenceDataHelpers'

// Stepper helpers
export {
  getStepperGroup,
  getIncrementButton,
  getDecrementButton,
  incrementStepper,
  decrementStepper,
  getStepperValue,
  getStepperDisplayValue,
  waitForStepperValue,
  waitForStepperDisplayValue,
  isStepperButtonDisabled,
} from './steppers'

// Section and modal helpers
export {
  getSection,
  getSectionAddButton,
  openSection,
  waitForModalOpen,
  waitForModalClosed,
  closeModal as closeModalHelper,
  closeModalAndWait,
  getSectionCount,
  waitForSectionCount,
  getModalButton,
  clickModalButton,
} from './sections'

// Combobox helpers
export {
  getCombobox,
  selectComboboxOption,
  getComboboxOptions,
  getComboboxOptionCount,
  isComboboxDisabled,
} from './combobox'
