import { Box, VStack, Button, Flex } from '@chakra-ui/react'
import { useCallback, useMemo } from 'react'
import { getTiltRotation } from '@/utils/tiltUtils'
import type { SURefClass } from 'salvageunion-reference'
import { getEffects, getTable } from 'salvageunion-reference'
import { EntityDisplayFooter } from '@/components/shared/EntityDisplayFooter'
import { RollTable } from '@/components/shared/RollTable'
import { EntityContainer } from '@/components/shared/EntityContainer'
import { EntitySubTitleElement } from '@/components/entity/EntityDisplay/EntitySubTitleContent'
import { EntityLeftContent } from '@/components/entity/EntityDisplay/EntityLeftContent'
import { EntityRightHeaderContent } from '@/components/entity/EntityDisplay/EntityRightHeaderContent'
import { EntityChassisPatterns } from '@/components/entity/EntityDisplay/EntityChassisPatterns'
import { EntityOptions } from '@/components/entity/EntityDisplay/EntityOptions'
import { EntityTopMatter } from '@/components/entity/EntityDisplay/EntityTopMatter'
import { EntityChassisAbilitiesContent } from '@/components/entity/EntityDisplay/EntityChassisAbilitiesContent'
import { EntityRequirementDisplay } from '@/components/entity/EntityDisplay/EntityRequirementDisplay'
import { getChassisAbilities } from 'salvageunion-reference'
import { EntityChoices } from '@/components/entity/EntityDisplay/EntityChoices'
import { EntityGrants } from '@/components/entity/EntityDisplay/EntityGrants'
import { ClassAbilitiesList } from '@/components/PilotLiveSheet/ClassAbilitiesList'
import { EntityBonusPerTechLevel } from '@/components/entity/EntityDisplay/EntityBonusPerTechLevel'
import { useEntityDisplayContext } from '@/components/entity/EntityDisplay/useEntityDisplayContext'
import { ConditionalSheetInfo } from '@/components/entity/EntityDisplay/ConditionalSheetInfo'
import { EntityPopulationRange } from '@/components/entity/EntityDisplay/EntityPopulationRange'
import type { ButtonProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

function ButtonWithConfig({
  buttonConfig,
}: {
  buttonConfig: ButtonProps & { children: ReactNode }
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      buttonConfig.onClick?.(e)
    },
    [buttonConfig]
  )

  return (
    <Button w="full" mt={3} onClick={handleClick} {...buttonConfig}>
      {buttonConfig.children}
    </Button>
  )
}

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
    showFooter,
    rightLabel,
    damaged,
    disabled,
    buttonConfig,
    userChoices,
    onChoiceSelection,
    hideImage,
  } = useEntityDisplayContext()

  return (
    <EntityContainer
      bg={'su.white'}
      w="full"
      headerBg={headerBg}
      headerOpacity={opacity.header}
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
      titleRotation={useMemo(() => (damaged ? getTiltRotation() : 0), [damaged])}
      bodyPadding="0"
      onHeaderClick={handleHeaderClick}
      headerTestId="frame-header-container"
    >
      {(!collapsible || isExpanded) && (
        <VStack
          flex="1"
          bg={contentBg}
          opacity={opacity.content}
          p={0}
          gap={spacing.smallGap}
          alignItems="stretch"
          minW="0"
          w="full"
        >
          <EntityTopMatter hideActions={hideActions} hideImage={hideImage}>
            {children}
          </EntityTopMatter>

          {compact && schemaName === 'chassis' && getChassisAbilities(data) && (
            <Box p={spacing.contentPadding}>
              <EntityChassisAbilitiesContent />
            </Box>
          )}

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
                  labelBgColor="brand.srd"
                  label="Damaged Effect"
                />
              )}
              {schemaName === 'classes' && (
                <ClassAbilitiesList
                  compact={compact}
                  selectedClass={
                    'coreTrees' in data &&
                    Array.isArray((data as { coreTrees: string[] }).coreTrees)
                      ? (data as SURefClass)
                      : undefined
                  }
                  selectedAdvancedClass={
                    'hybrid' in data && (data as { hybrid?: boolean }).hybrid === true
                      ? (data as SURefClass)
                      : undefined
                  }
                />
              )}
              <EntityGrants />
            </>
          )}
          {buttonConfig && (
            <Flex p={spacing.contentPadding}>
              <ButtonWithConfig buttonConfig={buttonConfig} />
            </Flex>
          )}
          <EntityChoices userChoices={userChoices} onChoiceSelection={onChoiceSelection} />
          {(showFooter ?? !hideActions) && <EntityDisplayFooter bg={headerBg} />}
        </VStack>
      )}
    </EntityContainer>
  )
}
