# Changelog

## 0.1.0 (en curso)

- Fixtures offline para tests (un JSON por endpoint, 19 endpoints).
- README final con documentación completa.
- Cierre de la API pública con TSDoc (TypeDoc → referencia de API).

### API pública

- `BCRAClient` con 5 resources (`deudores`, `cheques`, `estadisticasCambiarias`,
  `monetarias`, `regimenDeTransparencia`) que cubren los 19 endpoints.
- Endpoints versionados con resolución a la versión más reciente.
- Modelos tipados (`Result*V*`) y deserializadores `from*`.
- Jerarquía de errores: `BCRAError`, `BCRAHTTPError`, `BCRAConnectionError`,
  `BCRATimeoutError`, `BCRAEndpointVersionError`.
- `RetryPolicy` con backoff exponencial y soporte `Retry-After`; `parseRetryAfter`.
- Cero dependencias de runtime (fetch nativo de Node >= 18).