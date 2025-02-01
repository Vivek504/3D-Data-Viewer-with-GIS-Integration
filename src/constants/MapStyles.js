export const MAP_STYLES = Object.freeze({
    STREETS: 0,
    OUTDOORS: 1,
    LIGHT: 2,
    DARK: 3,
    SATELLITE: 4,
    SATELLITE_STREETS: 5,
    NAVIGATION_DAY: 6,
    NAVIGATION_NIGHT: 7
});

export const MAP_STYLE_DROPDOWN_NAMES = Object.freeze({
    [MAP_STYLES.STREETS]: "Streets",
    [MAP_STYLES.OUTDOORS]: "Outdoors",
    [MAP_STYLES.LIGHT]: "Light",
    [MAP_STYLES.DARK]: "Dark",
    [MAP_STYLES.SATELLITE]: "Satellite",
    [MAP_STYLES.SATELLITE_STREETS]: "Satellite Streets",
    [MAP_STYLES.NAVIGATION_DAY]: "Navigation Day",
    [MAP_STYLES.NAVIGATION_NIGHT]: "Navigation Night"
});

export const MAP_STYLE_URLS = Object.freeze({
    [MAP_STYLES.STREETS]: "mapbox://styles/mapbox/streets-v12",
    [MAP_STYLES.OUTDOORS]: "mapbox://styles/mapbox/outdoors-v12",
    [MAP_STYLES.LIGHT]: "mapbox://styles/mapbox/light-v11",
    [MAP_STYLES.DARK]: "mapbox://styles/mapbox/dark-v11",
    [MAP_STYLES.SATELLITE]: "mapbox://styles/mapbox/satellite-v9",
    [MAP_STYLES.SATELLITE_STREETS]: "mapbox://styles/mapbox/satellite-streets-v12",
    [MAP_STYLES.NAVIGATION_DAY]: "mapbox://styles/mapbox/navigation-day-v1",
    [MAP_STYLES.NAVIGATION_NIGHT]: "mapbox://styles/mapbox/navigation-night-v1"
});