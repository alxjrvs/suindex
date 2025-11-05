import { Box, VStack, Button, type ButtonProps, Flex } from '@chakra-ui/react'
import { type ReactNode, useState, memo } from 'react'
import type {
  SURefAdvancedClass,
  SURefCoreClass,
  SURefMetaEntity,
  SURefMetaSchemaName,
} from 'salvageunion-reference'
import { PageReferenceDisplay } from '../../shared/PageReferenceDisplay'
import { RollTable } from '../../shared/RollTable'
import { RoundedBox } from '../../shared/RoundedBox'
import { EntityAbsoluteContent } from './EntityAbsoluteContent'
import { EntitySubTitleElement } from './EntitySubTitleContent'
import { EntityLeftContent } from './EntityLeftContent'
import { EntityRightHeaderContent } from './EntityRightHeaderContent'
import { EntityChassisPatterns } from './EntityChassisPatterns'
import { EntityTechLevelEffects } from './EntityTechLevelEffects'
import { EntityOptions } from './EntityOptions'
import { EntityTopMatter } from './EntityTopMatter'
import { EntityRequirementDisplay } from './EntityRequirementDisplay'
import { EntityChoices } from './EntityChoices'
import { ClassAbilitiesList } from '../../PilotLiveSheet/ClassAbilitiesList'
import { EntityBonusPerTechLevel } from './EntityBonusPerTechLevel'
import { EntityDisplayProvider } from './entityDisplayProvider'
import { useEntityDisplayContext } from './useEntityDisplayContext'
import { ConditionalSheetDisplay } from './ConditionalSheetDisplay'
import { EntityPopulationRange } from './EntityPopulationRange'

type EntityDisplayProps = {
  /** Entity data to display */
  data: SURefMetaEntity | undefined
  /** Schema name for the entity */
  schemaName: SURefMetaSchemaName
  /** Optional header background color override */
  headerColor?: string
  /** Whether the ability is trained (affects header opacity for abilities) */
  dimHeader?: boolean
  /** Optional children to render in the content area */
  children?: ReactNode
  /** Optional click handler for the entity */
  onClick?: () => void
  /** Whether the entity is disabled (affects opacity and click behavior) */
  disabled?: boolean
  /** Whether the entity can be collapsed/expanded */
  collapsible?: boolean
  /** Default expanded state (only used if expanded is not controlled) */
  defaultExpanded?: boolean
  /** Controlled expanded state */
  expanded?: boolean
  /** Callback when expanded state changes */
  onToggleExpanded?: () => void
  /** Optional button configuration - if provided, renders a button at the bottom of the entity */
  buttonConfig?: ButtonProps & { children: ReactNode }
  /** Optional label displayed in the top-right corner */
  rightLabel?: string
  /** Whether to use compact styling */
  compact?: boolean
  /** Whether to hide the level display */
  hideLevel?: boolean
  /** Whether or not to show the actions */
  hideActions?: boolean
  /** User choices object matching the format sent to the API: Record<choiceId, "schemaName||entityId"> */
  userChoices?: Record<string, string> | null
  /** Callback when a choice is selected - if undefined, we're in schema page mode (not a live sheet) */
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
}

export const EntityDisplay = memo(function EntityDisplay({
  rightLabel,
  data,
  hideLevel = false,
  headerColor,
  dimHeader = false,
  children,
  onClick,
  disabled = false,
  collapsible = false,
  defaultExpanded = true,
  expanded,
  onToggleExpanded,
  buttonConfig,
  hideActions = false,
  schemaName,
  compact = false,
  userChoices,
  onChoiceSelection,
}: EntityDisplayProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  if (!data) return null

  const headerOpacity = dimHeader ? 0.5 : 1
  const contentOpacity = disabled ? 0.5 : 1

  const isExpanded = expanded !== undefined ? expanded : internalExpanded

  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const handleHeaderClick = () => {
    // Priority 1: If there's a button config and it's collapsible, toggle
    if (buttonConfig && collapsible) {
      handleToggle()
      return
    }

    // Priority 2: If there's an onClick handler and not disabled, call it
    if (onClick && !disabled) {
      onClick()
      return
    }

    // Priority 3: If collapsible, toggle
    if (collapsible) {
      handleToggle()
    }
  }

  // In compact mode, only show extra sections if actions are not hidden
  // In normal mode, always show extra sections
  const shouldShowExtraContent = compact ? !hideActions : true

  return (
    <EntityDisplayProvider
      data={data}
      schemaName={schemaName}
      compact={compact}
      headerColor={headerColor}
    >
      <EntityDisplayContent
        hideLevel={hideLevel}
        headerOpacity={headerOpacity}
        contentOpacity={contentOpacity}
        isExpanded={isExpanded}
        collapsible={collapsible}
        rightLabel={rightLabel}
        handleHeaderClick={handleHeaderClick}
        shouldShowExtraContent={shouldShowExtraContent}
        hideActions={hideActions}
        disabled={disabled}
        buttonConfig={buttonConfig}
        userChoices={userChoices}
        onChoiceSelection={onChoiceSelection}
      >
        {children}
      </EntityDisplayContent>
    </EntityDisplayProvider>
  )
})

interface EntityDisplayContentProps {
  hideLevel: boolean
  headerOpacity: number
  contentOpacity: number
  isExpanded: boolean
  collapsible: boolean
  rightLabel?: string
  handleHeaderClick: () => void
  shouldShowExtraContent: boolean
  hideActions: boolean
  disabled: boolean
  buttonConfig?: ButtonProps & { children: ReactNode }
  userChoices?: Record<string, string> | null
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
  children?: ReactNode
}

function EntityDisplayContent({
  hideLevel,
  headerOpacity,
  contentOpacity,
  isExpanded,
  collapsible,
  rightLabel,
  handleHeaderClick,
  shouldShowExtraContent,
  hideActions,
  disabled,
  buttonConfig,
  userChoices,
  onChoiceSelection,
  children,
}: EntityDisplayContentProps) {
  const { data, schemaName, compact, title, headerBg, spacing, contentBg } =
    useEntityDisplayContext()

  return (
    <RoundedBox
      borderWidth="2px"
      bg={'su.lightBlue'}
      w="full"
      headerBg={headerBg}
      headerOpacity={headerOpacity}
      bottomHeaderBorder
      absoluteElements={<EntityAbsoluteContent hideLevel={hideLevel} />}
      leftContent={<EntityLeftContent />}
      subTitleContent={<EntitySubTitleElement />}
      rightContent={
        <EntityRightHeaderContent
          isExpanded={isExpanded}
          collapsible={collapsible}
          rightLabel={rightLabel}
        />
      }
      compact={compact}
      title={title}
      bodyPadding="0"
      onHeaderClick={handleHeaderClick}
      headerTestId="frame-header-container"
    >
      {(!collapsible || isExpanded) && (
        <VStack
          flex="1"
          bg={contentBg}
          borderBottomRightRadius="md"
          borderBottomLeftRadius="md"
          opacity={contentOpacity}
          p={0}
          gap={spacing.largeGap}
          alignItems="stretch"
          minW="0"
          w="full"
        >
          <EntityTopMatter hideActions={hideActions} />

          <EntityPopulationRange />
          <EntityBonusPerTechLevel />
          <ConditionalSheetDisplay propertyName="effect" />

          <EntityRequirementDisplay />
          {shouldShowExtraContent && (
            <>
              <EntityChassisPatterns />
              <EntityOptions />
              {'table' in data && data.table && (
                <Box p={spacing.contentPadding} borderRadius="md" position="relative" zIndex={10}>
                  <RollTable
                    disabled={disabled}
                    table={data.table}
                    showCommand
                    compact
                    tableName={'name' in data ? String(data.name) : undefined}
                  />
                </Box>
              )}
              <EntityTechLevelEffects />
              {'damagedEffect' in data && data.damagedEffect && compact && (
                <ConditionalSheetDisplay
                  propertyName="damagedEffect"
                  labelBgColor="su.brick"
                  borderColor="su.brick"
                  label="Damaged Effect"
                />
              )}
              {schemaName.includes('classes') && (
                <ClassAbilitiesList
                  compact={compact}
                  selectedClass={
                    schemaName === 'classes.core' ? (data as SURefCoreClass) : undefined
                  }
                  selectedAdvancedClass={
                    schemaName === 'classes.advanced' ? (data as SURefAdvancedClass) : undefined
                  }
                />
              )}
              <EntityChoices userChoices={userChoices} onChoiceSelection={onChoiceSelection} />
              {children && (
                <Box mt="3" p={spacing.contentPadding}>
                  {children}
                </Box>
              )}
              {buttonConfig && (
                <Flex p={spacing.contentPadding}>
                  <Button
                    w="full"
                    mt={3}
                    onClick={(e) => {
                      e.stopPropagation()
                      buttonConfig.onClick?.(e)
                    }}
                    {...buttonConfig}
                  >
                    {buttonConfig.children}
                  </Button>
                </Flex>
              )}
            </>
          )}
          {!hideActions && <PageReferenceDisplay bg={headerBg} />}
        </VStack>
      )}
    </RoundedBox>
  )
}
