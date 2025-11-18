import { Box, VStack, Button, Flex } from '@chakra-ui/react'
import type { SURefAdvancedClass, SURefCoreClass } from 'salvageunion-reference'
import { getEffects, getTable } from 'salvageunion-reference'
import { PageReferenceDisplay } from '../../../shared/PageReferenceDisplay'
import { RollTable } from '../../../shared/RollTable'
import { RoundedBox } from '../../../shared/RoundedBox'
import { EntitySubTitleElement } from '../EntitySubTitleContent'
import { EntityLeftContent } from '../EntityLeftContent'
import { EntityRightHeaderContent } from '../EntityRightHeaderContent'
import { EntityChassisPatterns } from '../EntityChassisPatterns'
import { EntityOptions } from '../EntityOptions'
import { EntityTopMatter } from '../EntityTopMatter'
import { EntityRequirementDisplay } from '../EntityRequirementDisplay'
import { EntityChoices } from '../EntityChoices'
import { EntityGrants } from '../EntityGrants'
import { ClassAbilitiesList } from '../../../PilotLiveSheet/ClassAbilitiesList'
import { EntityBonusPerTechLevel } from '../EntityBonusPerTechLevel'
import { useEntityDisplayContext } from '../useEntityDisplayContext'
import { ConditionalSheetInfo } from '../ConditionalSheetInfo'
import { EntityPopulationRange } from '../EntityPopulationRange'

export function EntityDisplayContent({ children }: { children?: React.ReactNode }) {
  const {
    data,
    schemaName,
    compact,
    title,
    headerBg,
    spacing,
    contentBg,
    opacity,
    shouldShowExtraContent,
    handleHeaderClick,
    isExpanded,
    collapsible,
    hideActions,
    hidePatterns,
    rightLabel,
    disabled,
    buttonConfig,
    userChoices,
    onChoiceSelection,
  } = useEntityDisplayContext()

  return (
    <RoundedBox
      borderWidth="2px"
      bg={'su.lightBlue'}
      w="full"
      headerBg={headerBg}
      headerOpacity={opacity.header}
      bottomHeaderBorder
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
          opacity={opacity.content}
          p={0}
          gap={spacing.smallGap}
          alignItems="stretch"
          minW="0"
          w="full"
        >
          <EntityTopMatter hideActions={hideActions} />

          <EntityPopulationRange />
          <EntityBonusPerTechLevel />
          {getEffects(data)?.map((effect, index) => (
            <ConditionalSheetInfo
              key={index}
              propertyName="effects"
              label={effect.label}
              value={effect.value}
            />
          ))}

          <EntityRequirementDisplay />
          {shouldShowExtraContent && (
            <>
              {!hidePatterns && <EntityChassisPatterns />}
              <EntityOptions />
              {getTable(data) && (
                <Box p={spacing.contentPadding} borderRadius="md" position="relative" zIndex={10}>
                  <RollTable
                    disabled={disabled}
                    table={getTable(data)!}
                    showCommand
                    compact
                    tableName={'name' in data ? String(data.name) : undefined}
                  />
                </Box>
              )}
              {'damagedEffect' in data && data.damagedEffect && compact && (
                <ConditionalSheetInfo
                  propertyName="damagedEffect"
                  labelBgColor="su.brick"
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
              <EntityGrants />
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
          <EntityChoices userChoices={userChoices} onChoiceSelection={onChoiceSelection} />
          {!hideActions && <PageReferenceDisplay bg={headerBg} />}
        </VStack>
      )}
    </RoundedBox>
  )
}
