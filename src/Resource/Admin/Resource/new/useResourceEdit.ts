import {ChangeEvent, useState} from "react";
import {ResourceClass, ResourceKeys, ResourceTypes} from "@/Resource";

export const useResourceEdit = (resource: ResourceClass) => {
  const [isKeyPristine, setIsKeyPristine] = useState(true);
  console.log(resource.id)

  const limitMaxInitial = typeof resource.max === 'number' && resource.max !== Infinity
  const [limitMax, setLimitMax] = useState(limitMaxInitial);
  const [limitMin, setLimitMin] = useState(!!resource?.min && resource.min !== -Infinity);
  const onToggleMax = () => {
    if (limitMax) {
      resource.setTo({max: Infinity})
    }
    setLimitMax(!limitMax)
  }

  const onToggleMin = () => {
    if (limitMin) {
      resource.setTo({min: -Infinity})
    }
    setLimitMin(!limitMin)
  }

  const [min, setMin] = useState(typeof resource?.min === 'number' ? resource.min : -Infinity);
  const [max, setMax] = useState(typeof resource?.max === 'number' ? resource.max : Infinity);
  const onSetMax = (e: ChangeEvent<HTMLInputElement>) =>
    setMax(Number(e.target.value))

  const onSetMin = (e: ChangeEvent<HTMLInputElement>) =>
    setMin(Number(e.target.value))

  const onWriteMin = () =>
    resource.setTo({min})
  const onWriteMax = () =>
    resource.setTo({max})



  const setValue = (e: ChangeEvent<HTMLInputElement>)=> {
    const value = Number(e.target.value);
    resource.setTo({value})
  }
  const setKey = (e: ChangeEvent<HTMLInputElement>)=> {
    const key = e.target.value as ResourceKeys;
    resource.setTo({key})
    if (isKeyPristine) {
      setIsKeyPristine(false)
    }
  }
  const setLabel = (e: ChangeEvent<HTMLInputElement>)=> {
    const label = e.target.value
    resource.setTo({label})
    if (isKeyPristine) {
      const generatedKey = e.target.value.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase() as ResourceKeys
      resource.setTo({key: generatedKey})
    }
  }
  const setType = (type: string) => resource.setTo({type: type as ResourceTypes})

  return {
    min,
    max,
    onSetMax,
    onSetMin,
    onWriteMin,
    onWriteMax,
    setKey,
    setLabel,
    setType,
    setValue,
    limitMin,
    limitMax,
    onToggleMin,
    onToggleMax,
  }
}
