import {ChangeEvent, useState} from "react";
import {ResourceClass, ResourceKeys, ResourceTypes} from "@/Resource";

export const useResourceEdit = (resource: ResourceClass) => {
  // const [isKeyPristine, setIsKeyPristine] = useState(true);
  const [min, setMin] = useState(typeof resource?.min === 'number' ? resource.min : -Infinity);
  // console.log(resource.max)
  const [max, setMax] = useState(typeof resource?.max === 'number' ? resource.max : Infinity);
  console.log('useResouceEdit')
  console.log(resource.max, max)

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
  }
  const setLabel = (e: ChangeEvent<HTMLInputElement>)=> {
    const label = e.target.value
    resource.setTo({label})
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
  }
}