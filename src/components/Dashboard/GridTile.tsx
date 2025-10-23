import { Button, Text } from '@chakra-ui/react'
import type { ButtonProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface GridTileButtonProps extends ButtonProps {
  h?: ButtonProps['h']
}

export function GridTileButton({ h = '32', p = 4, children, ...rest }: GridTileButtonProps) {
  return (
    <Button
      bg="su.white"
      borderWidth="2px"
      borderColor="su.lightBlue"
      borderRadius="lg"
      p={p}
      _hover={{ borderColor: 'su.brick' }}
      textAlign="left"
      h={h}
      display="flex"
      flexDirection="column"
      variant="outline"
      {...rest}
    >
      {children as ReactNode}
    </Button>
  )
}

interface CreateTileButtonProps extends ButtonProps {
  label: string
  accentColor: string
  bgColor: string
  h?: ButtonProps['h']
}

export function CreateTileButton({
  label,
  accentColor,
  bgColor,
  h = '32',
  p = 4,
  ...rest
}: CreateTileButtonProps) {
  return (
    <Button
      onClick={rest.onClick}
      bg={bgColor}
      borderWidth="2px"
      borderStyle="dashed"
      borderColor={accentColor}
      borderRadius="lg"
      p={p}
      _hover={{ bg: accentColor, borderStyle: 'solid' }}
      h={h}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      variant="outline"
      {...rest}
    >
      <Text fontSize="4xl" color={accentColor} mb={1}>
        +
      </Text>
      <Text fontSize="sm" fontWeight="bold" color={accentColor}>
        {label}
      </Text>
    </Button>
  )
}

export default GridTileButton
