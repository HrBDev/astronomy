//[astronomy](../../../index.md)/[io.github.cosinekitty.astronomy](../index.md)/[Astronomy](index.md)/[rotationHorEcl](rotation-hor-ecl.md)

# rotationHorEcl

[jvm]\
fun [rotationHorEcl](rotation-hor-ecl.md)(time: [AstroTime](../-astro-time/index.md), observer: [Observer](../-observer/index.md)): [RotationMatrix](../-rotation-matrix/index.md)

Calculates a rotation matrix from horizontal (HOR) to ecliptic J2000 (ECL).

This is one of the family of functions that returns a rotation matrix for converting from one orientation to another. Source: HOR = horizontal system. Target: ECL = ecliptic system, using equator at J2000 epoch.

## Parameters

jvm

| | |
|---|---|
| time | The date and time of the horizontal observation. |
| observer | The location of the horizontal observer. |