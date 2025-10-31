import { Box, Flex, VStack, Button, type ButtonProps } from '@chakra-ui/react'
import { type ReactNode, useState } from 'react'
import type {
  SURefAdvancedClass,
  SURefCoreClass,
  SURefHybridClass,
  SURefMetaEntity,
  SURefSchemaName,
} from 'salvageunion-reference'
import { techLevelColors } from '../../../theme'
import { PageReferenceDisplay } from '../../shared/PageReferenceDisplay'
import { RollTable } from '../../shared/RollTable'
import { RoundedBox } from '../../shared/RoundedBox'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { calculateBackgroundColor, extractName, extractTechLevel } from '../entityDisplayHelpers'
import { EntityAbsoluteContent } from './EntityAbsoluteContent'
import { EntitySubTitleElement } from './EntitySubTitleContent'
import { EntityLeftContent } from './EntityLeftContent'
import { EntityRightContent } from './EntityRightContent'
import { EntitySidebar } from './EntitySidebar'
import { EntityChassisPatterns } from './EntityChassisPatterns'
import { EntityTechLevelEffects } from './EntityTechLevelEffects'
import { EntityOptions } from './EntityOptions'
import { EntityTopMatter } from './EntityTopMatter'
import { EntityRequirementDisplay } from './EntityRequirementDisplay'
import { ClassAbilitiesList } from '../../PilotLiveSheet/ClassAbilitiesList'

type EntityDisplayProps = {
  /** Entity data to display */
  data: SURefMetaEntity | undefined
  /** Schema name for the entity */
  schemaName: SURefSchemaName | 'actions'
  /** Optional header background color override */
  headerColor?: string
  /** Whether the ability is trained (affects header opacity for abilities) */
  trained?: boolean
  /** Optional children to render in the content area */
  children?: ReactNode
  /** Optional click handler for the entity */
  onClick?: () => void
  /** Whether the entity is disabled (affects opacity and click behavior) */
  disabled?: boolean
  /** Whether the entity is dimmed (affects opacity) */
  dimmed?: boolean
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
}

export function EntityDisplay({
  rightLabel,
  data,
  hideLevel = false,
  headerColor,
  trained = true,
  children,
  onClick,
  disabled = false,
  dimmed = false,
  collapsible = false,
  defaultExpanded = true,
  expanded,
  onToggleExpanded,
  buttonConfig,
  hideActions = false,
  schemaName,
  compact = false,
}: EntityDisplayProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  if (!data) return null

  const title = extractName(data, schemaName)
  const techLevel = extractTechLevel(data)

  const backgroundColor = calculateBackgroundColor(
    schemaName,
    headerColor,
    techLevel,
    data,
    techLevelColors
  )
  const headerOpacity = trained ? 1 : 0.5
  const contentOpacity = disabled || dimmed ? 0.5 : 1

  // Check if there's any content to render
  const hasContent =
    ('actions' in data && data.actions && data.actions.length > 0) ||
    ('notes' in data && !!data.notes) ||
    ('description' in data && !!data.description && schemaName !== 'abilities') ||
    ('effect' in data && !!data.effect) ||
    ('options' in data && data.options && data.options.length > 0) ||
    ('table' in data && !!data.table) ||
    ('techLevelEffects' in data && data.techLevelEffects && data.techLevelEffects.length > 0) ||
    ('patterns' in data && data.patterns && data.patterns.length > 0) ||
    !!children ||
    !!buttonConfig ||
    ('page' in data && data.page)

  const isExpanded = expanded !== undefined ? expanded : internalExpanded

  const handleToggle = () => {
    if (onToggleExpanded) {
      onToggleExpanded()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const handleHeaderClick = () => {
    if (buttonConfig && collapsible) {
      handleToggle()
    } else if (onClick && !disabled) {
      onClick()
    } else if (collapsible) {
      handleToggle()
    }
  }

  const displayExtraSection = compact ? !hideActions : true

  return (
    <RoundedBox
      borderWidth="2px"
      bg="su.lightBlue"
      w="full"
      headerBg={backgroundColor}
      headerOpacity={headerOpacity}
      absoluteElements={
        <EntityAbsoluteContent
          schemaName={schemaName}
          data={data}
          compact={compact}
          hideLevel={hideLevel}
        />
      }
      leftContent={<EntityLeftContent schemaName={schemaName} data={data} compact={compact} />}
      subTitleContent={
        <EntitySubTitleElement schemaName={schemaName} data={data} compact={compact} />
      }
      rightContent={
        <EntityRightContent
          schemaName={schemaName}
          data={data}
          compact={compact}
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
      {(!collapsible || isExpanded) && hasContent && (
        <Flex bg={backgroundColor} w="full" borderBottomRadius="md" overflow="hidden">
          {/* Sidebar */}
          <EntitySidebar
            data={data}
            schemaName={schemaName}
            compact={compact}
            contentOpacity={contentOpacity}
          />
          {/* Main content area */}
          <VStack
            flex="1"
            bg="su.lightBlue"
            borderBottomRightRadius="md"
            opacity={contentOpacity}
            p={compact ? 1 : 3}
            gap={compact ? 3 : 6}
            alignItems="stretch"
            minW="0"
          >
            <EntityTopMatter
              hideActions={hideActions}
              data={data}
              schemaName={schemaName}
              compact={compact}
            />

            {'effect' in data && data.effect && (
              <SheetDisplay compact={compact} value={data.effect} />
            )}

            <EntityRequirementDisplay data={data} compact={compact} schemaName={schemaName} />
            {displayExtraSection && (
              <>
                <EntityChassisPatterns data={data} schemaName={schemaName} compact={compact} />
                <EntityOptions data={data} compact={compact} schemaName={schemaName} />
                {'table' in data && data.table && (
                  <Box borderRadius="md" position="relative" zIndex={10}>
                    <RollTable
                      disabled={disabled || dimmed}
                      table={data.table}
                      showCommand
                      compact
                      tableName={'name' in data ? String(data.name) : undefined}
                    />
                  </Box>
                )}
                <EntityTechLevelEffects data={data} compact={compact} schemaName={schemaName} />
                {'damagedEffect' in data && data.damagedEffect && compact && (
                  <SheetDisplay
                    labelBgColor="su.brick"
                    borderColor="su.brick"
                    label="Damaged Effect"
                    value={data.damagedEffect}
                  />
                )}
                {schemaName.includes('classes') && (
                  <ClassAbilitiesList
                    selectedClass={
                      schemaName === 'classes.core' ? (data as SURefCoreClass) : undefined
                    }
                    selectedAdvancedClass={
                      schemaName === 'classes.advanced' || schemaName === 'classes.hybrid'
                        ? (data as SURefAdvancedClass | SURefHybridClass)
                        : undefined
                    }
                  />
                )}
                {children && <Box mt="3">{children}</Box>}
                {buttonConfig && (
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
                )}
              </>
            )}
            <Box mt="auto">
              <PageReferenceDisplay compact={compact} data={data} schemaName={schemaName} />
            </Box>
          </VStack>
        </Flex>
      )}
    </RoundedBox>
  )
}
