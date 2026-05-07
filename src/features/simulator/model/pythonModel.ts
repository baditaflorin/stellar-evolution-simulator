export const PYODIDE_VERSION = "0.28.3";

export const STELLAR_MODEL_SOURCE = String.raw`
import json
import math

SCHEMA_VERSION = "stellar-track/v1"


def clamp(value, low, high):
    return max(low, min(high, value))


def smoothstep(value):
    x = clamp(value, 0.0, 1.0)
    return x * x * (3.0 - 2.0 * x)


def lerp(start, end, value):
    return start + (end - start) * value


def log_lerp(start, end, value):
    safe_start = max(start, 1e-12)
    safe_end = max(end, 1e-12)
    return math.exp(lerp(math.log(safe_start), math.log(safe_end), value))


def remnant_for_mass(mass):
    if mass >= 20.0:
        return "Black hole"
    if mass >= 8.0:
        return "Neutron star"
    return "White dwarf"


def main_sequence_luminosity(mass):
    if mass < 0.43:
        return max(0.0006, 0.23 * mass ** 2.3)
    if mass < 2.0:
        return mass ** 4.0
    if mass < 20.0:
        return 1.5 * mass ** 3.5
    return 1.5 * 20.0 ** 3.5 * (mass / 20.0) ** 1.45


def main_sequence_radius(mass):
    if mass < 1.0:
        return max(0.12, mass ** 0.8)
    if mass < 10.0:
        return mass ** 0.57
    return 10.0 ** 0.57 * (mass / 10.0) ** 0.45


def temperature_from_lum_radius(luminosity, radius):
    return 5772.0 * (luminosity / max(radius * radius, 1e-12)) ** 0.25


def final_core_mass(mass, remnant):
    if remnant == "White dwarf":
        return min(1.34, 0.46 + 0.105 * mass)
    if remnant == "Neutron star":
        return min(2.25, 1.34 + 0.045 * (mass - 8.0))
    return max(4.0, 0.28 * mass + 1.4)


def total_lifetime_gyr(mass, remnant):
    main = 10.0 * mass ** -2.5
    if mass < 0.5:
        return max(80.0, main * 1.18)
    if remnant == "White dwarf":
        return main * (1.08 + 0.04 / max(mass, 0.2))
    if remnant == "Neutron star":
        return main * 1.055
    return main * 1.035


def phase_for_progress(progress, mass, remnant):
    if progress < 0.035:
        return "Protostar"
    if progress < 0.68:
        return "Main sequence"
    if progress < 0.78:
        return "Subgiant"
    if progress < 0.90:
        return "Red supergiant" if mass >= 8.0 else "Red giant"
    if progress < 0.96:
        return "Planetary nebula" if remnant == "White dwarf" else "Core collapse"
    return remnant


def sample_track(mass, sample_count=260):
    remnant = remnant_for_mass(mass)
    lifetime = total_lifetime_gyr(mass, remnant)
    lum_ms = main_sequence_luminosity(mass)
    radius_ms = main_sequence_radius(mass)
    temp_ms = temperature_from_lum_radius(lum_ms, radius_ms)

    if mass < 8.0:
        peak_radius = 90.0 * max(mass, 0.25) ** 0.45
        peak_lum = max(lum_ms * 55.0, 1200.0 * max(mass, 0.25) ** 1.25)
        cool_temp = 3300.0 + 240.0 * min(mass, 3.0)
    else:
        peak_radius = 510.0 * (mass / 8.0) ** 0.35
        peak_lum = max(lum_ms * 18.0, 52000.0 * (mass / 8.0) ** 1.55)
        cool_temp = 3650.0 + 22.0 * min(mass, 35.0)

    core_final = final_core_mass(mass, remnant)
    points = []

    for idx in range(sample_count):
        progress = idx / (sample_count - 1)
        phase = phase_for_progress(progress, mass, remnant)
        age = lifetime * progress

        if progress < 0.035:
            s = smoothstep(progress / 0.035)
            radius = log_lerp(radius_ms * 2.8, radius_ms, s)
            luminosity = log_lerp(max(lum_ms * 0.08, 0.0001), lum_ms, s)
            temp = lerp(3100.0, temp_ms, s)
            core = 0.015 * mass + 0.03 * mass * s
            mass_remaining = mass
        elif progress < 0.68:
            s = smoothstep((progress - 0.035) / 0.645)
            radius = radius_ms * (1.0 + 0.42 * s)
            luminosity = lum_ms * (1.0 + 1.35 * s)
            temp = temp_ms * (1.0 + 0.05 * s - 0.08 * s * s)
            core = lerp(0.05 * mass, min(core_final * 0.55, 0.25 * mass), s)
            mass_remaining = mass * (1.0 - 0.015 * s * min(mass, 12.0))
        elif progress < 0.78:
            s = smoothstep((progress - 0.68) / 0.10)
            radius = log_lerp(radius_ms * 1.45, peak_radius * 0.22, s)
            luminosity = log_lerp(lum_ms * 2.4, peak_lum * 0.32, s)
            temp = lerp(temp_ms * 0.94, cool_temp + 520.0, s)
            core = lerp(min(core_final * 0.55, 0.25 * mass), core_final * 0.72, s)
            mass_remaining = mass * (1.0 - 0.05 * s * min(mass / 8.0, 2.2))
        elif progress < 0.90:
            s = smoothstep((progress - 0.78) / 0.12)
            radius = log_lerp(peak_radius * 0.22, peak_radius, s)
            luminosity = log_lerp(peak_lum * 0.32, peak_lum, s)
            temp = lerp(cool_temp + 520.0, cool_temp, s)
            core = lerp(core_final * 0.72, core_final * 0.93, s)
            mass_remaining = max(core_final * 1.04, mass * (1.0 - 0.20 * s * min(mass / 6.0, 2.5)))
        elif progress < 0.96:
            s = smoothstep((progress - 0.90) / 0.06)
            if remnant == "White dwarf":
                radius = log_lerp(peak_radius, 0.018, s)
                luminosity = log_lerp(peak_lum, max(0.012, 0.08 * mass), s)
                temp = lerp(cool_temp, 90000.0, s)
                mass_remaining = lerp(max(core_final * 1.15, mass * 0.72), core_final, s)
            else:
                radius = log_lerp(peak_radius, 0.00008, s)
                luminosity = log_lerp(peak_lum, peak_lum * 180.0, smoothstep(1.0 - abs(0.5 - s) * 2.0))
                temp = lerp(cool_temp, 120000.0, s)
                mass_remaining = lerp(max(core_final * 1.7, mass * 0.56), core_final, s)
            core = lerp(core_final * 0.93, core_final, s)
        else:
            s = smoothstep((progress - 0.96) / 0.04)
            if remnant == "White dwarf":
                radius = log_lerp(0.018, 0.011, s)
                luminosity = log_lerp(max(0.012, 0.08 * mass), 0.0006, s)
                temp = lerp(90000.0, 12500.0, s)
            elif remnant == "Neutron star":
                radius = 0.000018
                luminosity = log_lerp(max(1.0, peak_lum * 0.08), 0.00001, s)
                temp = lerp(950000.0, 650000.0, s)
            else:
                radius = 0.000001
                luminosity = log_lerp(max(0.4, peak_lum * 0.015), 0.000001, s)
                temp = lerp(1800.0, 2.7, s)
            core = core_final
            mass_remaining = core_final

        points.append({
            "ageGyr": age,
            "phase": phase,
            "radiusSolar": max(radius, 1e-8),
            "luminositySolar": max(luminosity, 1e-8),
            "effectiveTemperatureK": max(temp, 2.7),
            "coreMassSolar": max(core, 0.0),
            "massRemainingSolar": max(mass_remaining, core_final),
        })

    return points


def simulate_stellar_track(raw_input):
    payload = json.loads(raw_input)
    mass = float(payload["massSolar"])
    mass = clamp(mass, 0.1, 80.0)
    remnant = remnant_for_mass(mass)
    track = sample_track(mass)
    summary = {
        "remnant": remnant,
        "lifetimeGyr": track[-1]["ageGyr"],
        "peakRadiusSolar": max(point["radiusSolar"] for point in track),
        "peakLuminositySolar": max(point["luminositySolar"] for point in track),
        "finalCoreMassSolar": final_core_mass(mass, remnant),
        "finalSurfaceTemperatureK": track[-1]["effectiveTemperatureK"],
        "caveat": "Educational MESA-inspired approximation; not a full MESA calculation.",
    }
    return json.dumps({
        "schemaVersion": SCHEMA_VERSION,
        "inputMassSolar": mass,
        "summary": summary,
        "track": track,
    })
`;
