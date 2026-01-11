# Bite Web

## Known Issues

- recharts
  - Current: 2.15.4
  - Latest: 3.6.0
  - Issues: https://github.com/shadcn-ui/ui/issues/7669

- react-resizable-panels
  - Current: 3.0.6
  - Latest: 4.3.3
  - Issues: https://github.com/shadcn-ui/ui/issues/9118

## Data Fetching Architecture

```mermaid
sequenceDiagram
  autonumber
  participant App as APP
  participant UI as UI/Page
  participant Hook as Hook (custom)
  participant TQ as TanStack Query
  participant API as API
  participant Store as Store (zustand)
  participant Model as Model (schema/domain)

  App->>UI: Render / route
  UI->>Hook: useHook()

  Hook->>Store: read state (auth/filter/sort)
  Hook->>Model: build params (validate/transform)

  Hook->>TQ: useQuery(queryKey, queryFn)

  alt Cache hit
    TQ-->>Hook: return cached data
  else Cache miss / stale
    TQ->>API: fetch(queryFn)
    API->>Model: validate/shape DTO
    API-->>TQ: response
    TQ->>Model: normalize/parse
    TQ-->>Hook: return data
  end

  Hook-->>UI: { data, isLoading, error, actions }

```
