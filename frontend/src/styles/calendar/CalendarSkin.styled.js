import styled, { css } from "styled-components";

export const CalendarSkin = styled.div`
  && {
    ${({ $styles }) =>
      $styles &&
      css`
        /* calendar container */
        .react-calendar {
          ${$styles?.calendar?.background
            ? `background: ${$styles.calendar.background};`
            : ""}
          ${$styles?.calendar?.border
            ? `border: ${$styles.calendar.border};`
            : ""}
          ${$styles?.calendar?.radius
            ? `border-radius: ${$styles.calendar.radius};`
            : ""}
          ${$styles?.calendar?.fontSize
            ? `font-size: ${$styles.calendar.fontSize};`
            : ""}
          ${$styles?.calendar?.padding
            ? `padding: ${$styles.calendar.padding};`
            : ""}
        }

        /* navigation */
        .react-calendar__navigation {
          ${$styles?.nav?.height ? `height: ${$styles.nav.height};` : ""}
          ${$styles?.nav?.gap ? `margin-bottom: ${$styles.nav.gap};` : ""}
        }
        .react-calendar__navigation__label {
          ${$styles?.nav?.label?.fontSize
            ? `font-size: ${$styles.nav.label.fontSize};`
            : ""}
          ${$styles?.nav?.label?.fontWeight
            ? `font-weight: ${$styles.nav.label.fontWeight};`
            : ""}
        }
        .react-calendar__navigation button {
          ${$styles?.nav?.button?.background
            ? `background: ${$styles.nav.button.background};`
            : ""}
          ${$styles?.nav?.button?.color
            ? `color: ${$styles.nav.button.color};`
            : ""}
          ${$styles?.nav?.button?.radius
            ? `border-radius: ${$styles.nav.button.radius};`
            : ""}
          ${$styles?.nav?.button?.fontSize
            ? `font-size: ${$styles.nav.button.fontSize};`
            : ""}
          ${$styles?.nav?.button?.padding
            ? `padding: ${$styles.nav.button.padding};`
            : ""}
        }
        .react-calendar__navigation button:enabled:hover {
          ${$styles?.nav?.button?.hoverBg
            ? `background: ${$styles.nav.button.hoverBg};`
            : ""}
        }
        .react-calendar__navigation button:disabled {
          ${$styles?.nav?.button?.disabledOpacity
            ? `opacity: ${$styles.nav.button.disabledOpacity};`
            : ""}
        }

        /* weekdays */
        .react-calendar__month-view__weekdays {
          ${$styles?.weekdays?.base?.color
            ? `color: ${$styles.weekdays.base.color};`
            : ""}
          ${$styles?.weekdays?.base?.fontWeight
            ? `font-weight: ${$styles.weekdays.base.fontWeight};`
            : ""}
          ${$styles?.weekdays?.base?.transform
            ? `text-transform: ${$styles.weekdays.base.transform};`
            : ""}
          ${$styles?.weekdays?.base?.fontSize
            ? `font-size: ${$styles.weekdays.base.fontSize};`
            : ""}
        }
        .react-calendar__month-view__weekdays__weekday {
          ${$styles?.weekdays?.weekday?.padding
            ? `padding: ${$styles.weekdays.weekday.padding};`
            : ""}
        }

        /* tile */
        .react-calendar__tile {
          ${$styles?.tile?.base?.padding
            ? `padding: ${$styles.tile.base.padding};`
            : ""}
          ${$styles?.tile?.base?.border
            ? `border: ${$styles.tile.base.border};`
            : ""}
          ${$styles?.tile?.base?.radius
            ? `border-radius: ${$styles.tile.base.radius};`
            : ""}
          ${$styles?.tile?.base?.fontSize
            ? `font-size: ${$styles.tile.base.fontSize};`
            : ""}
          ${$styles?.tile?.base?.height
            ? `height: ${$styles.tile.base.height};`
            : ""}
          ${$styles?.tile?.base?.textAlign
            ? `text-align: ${$styles.tile.base.textAlign};`
            : ""}
          ${$styles?.tile?.base?.position
            ? `position: ${$styles.tile.base.position};`
            : ""}
        }
        .react-calendar__tile:enabled:hover {
          ${$styles?.tile?.hoverBg
            ? `background: ${$styles.tile.hoverBg};`
            : ""}
        }
        .react-calendar__tile--now {
          ${$styles?.tile?.today?.outline
            ? `outline: ${$styles.tile.today.outline};`
            : ""}
        }
        .react-calendar__tile--active {
          ${$styles?.tile?.active?.background
            ? `background: ${$styles.tile.active.background};`
            : ""}
          ${$styles?.tile?.active?.color
            ? `color: ${$styles.tile.active.color};`
            : ""}
        }
        .react-calendar__tile--disabled {
          ${$styles?.tile?.disabled?.color
            ? `color: ${$styles.tile.disabled.color};`
            : ""}
        }

        /* view specific tile min height */
        &[data-view="month"] .react-calendar__tile {
          ${$styles?.views?.month?.tileMinH
            ? `min-height: ${$styles.views.month.tileMinH};`
            : ""}
        }
        &[data-view="year"] .react-calendar__tile {
          ${$styles?.views?.year?.tileMinH
            ? `min-height: ${$styles.views.year.tileMinH};`
            : ""}
        }
      `}
  }
`;
