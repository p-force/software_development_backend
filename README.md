<p>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# Описание
Это базовый шаблон бэкенд приложения. 

Стэк: Nest JS, TypeORM, Postgres

## Оглавление
1. [Как начать новый проект](#как-начать-новый-проект)
2. [Требования](#требования)
3. [Конфигурирование](#конфигурирование)
   - [Основные настройки](#основные-настройки)
     - [Настройки БД](#настройки-бд)
     - [Версионирование API](#версионирование-api)
     - [Настройка пагинации](#настройка-пагинации)
   - [Настройка логгера](#настройка-логгера)
   - [Настройка Swagger](#настройка-swagger)
4. [Как приступить к работе в новом проекте](#как-приступить-к-работе-в-новом-проекте)
5. [Добавление конфигурации для своих модулей](#добавление-конфигурации-для-своих-модулей)
6. [Предустановленные DTO, декораторы, функции и типы](#предустановленные-dto-декораторы-функции-и-типы)
    - [DTO](#dto)
      - [BaseResponseDto](#baseresponsedto)
      - [PaginationDto](#paginationdto)
      - [BaseFilterDto](#basefilterdto)
      - [BaseSortingDto](#basesortingdto)
    - [Декораторы общего назначения](#декораторы-общего-назначения)
      - [@CurrentUser](#currentuser)
    - [Декораторы для Swagger](#декораторы-для-swagger)
      - [@ApiBaseResponse](#apibaseresponse)
      - [@ApiPaginationResponse](#apipaginationresponse)
      - [@ApiBaseResponseOneOf](#apibaseresponseoneof)
      - [@ApiQueryPagination](#apiquerypagination)
      - [@ApiBodyOneOf](#apibodyoneof)
    - [Функции](#функции)
      - [makeError](#makeerrorcode-errorcode-additional-recordstring-unknown)
      - [pageToSkip](#pagetoskippage-number-limit-number-number)
    - [Pipes](#pipes)
      - [EmailPipe](#emailpipe)
      - [PhonePipe](#phonepipe)
      - [PagePipe](#pagepipe)
      - [LimitPipe](#limitpipe)
7. [Стандартизация сообщений](#стандартизация-сообщений)


# Как начать новый проект
1. Создайте новый репозиторий.
2. Склонируйте этот репозиторий, выполнив команду:
```bash 
$ git clone https://github.com/laba-do/nest-backend-template.git
```
4. Настройте локальный репозиторий на новый. Для этого выполните следующие команды:
```bash
$ git remote rm origin
$ git remote add origin <URL нового репозитория, без скобок>
$ push -u origin main
```

# Требования
1. [Node 16.13.1 LTS](https://nodejs.org/en/download/). Для установки нескольких версий можете использовать [nvm](https://github.com/nvm-sh/nvm) или [nvm-windows](https://github.com/coreybutler/nvm-windows). Хотя на Windows рекомендую использовать WSL 2 и nvm.
2. Docker и docker-compose. Для Windows установка простая. Для Linux можете воспользоваться скриптом установки [dzen-docker-install](https://github.com/DzenDyn/dzen-docker-install).

# Конфигурирование

Для настройки приложения используется `.env` файл.
Пример настроек можно посмотреть в файле `.env.example`

## Основные настройки
Обязательно укажите настройки хоста и порта, а также адрес приложения.
Без этих настроек приложение не запустится:
```dotenv
APP_URL=http://localhost/api
PORT=80
HOST=0.0.0.0
```

### Настройки БД
Обязательно настройте подключение к БД.
```dotenv
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
```
Помимо этого, обязательно создайте файл `.postgres.env` и убедитесь, что настройки совпадают с тем что вы указали в файле `.env`:

```dotenv
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=postgres
```
При первом запуске контейнера с PostgeSQL будет настроена БД с именем и пользователем, указанными в файле `.postgres.env`

## Версионирование API
Шаблон преднастроен для использования версонирования по URI и  позволяет включить версионирование контроллеров и установить версию по умолчанию.
Подробнее можно посмотреть в [документации NestJS](https://docs.nestjs.com/techniques/versioning).
```dotenv
NEST_VERSIONING_ENABLE=false
NEST_VERSIONING_DEFAULT_VERSION=1
```

## Настройка пагинации
Максимальное число элементов (LIMIT), которое может быть передано для пагинации.
Необязательный параметр. По умолчанию значение установлено в 100.

```dotenv
MAX_LIMIT=100
```

## Настройка логгера
Вы можете также настроить работу логгера. Эти параметры не обязательны, если они не заданы, то будут использоваться такие:
```dotenv
# Уровень вывода консоли
# Может быть error, info, debug
LOG_CONSOLE_LEVEL=debug
# Уровень вывода в файл
LOG_FILE_LEVEL=info

# Парметры ниже будут видны только при уровне debug
# Логировать заголовки запросов
LOG_INCLUDE_HEADERS=false
# Логировать запросы
LOG_INCLUDE_REQUEST=false
# Логировать ответы
LOG_INCLUDE_RESPONSE=false
# Логировать query
LOG_INCLUDE_QUERY
```

## Настройка Swagger
В шаблон предустановлен Swagger-Ui для документирования API. По умолчанию он выключен.
Все перечисленные ниже настройки необязательны. Если они не сконфигурированы будут применены настройки по умолчанию.

```dotenv
# Включить Swagger-Ui
SWAGGER_ENABLE=true
# Заголовок страницы документации
SWAGGER_TITLE=NEST-BACKEND-TEMPLATE
# Описание
SWAGGER_DESCRIPTION="BLA, BLA BLA"
# Версия документации API
SWAGGER_VERSION=1.0

# Путь, относительно базового урл приложения, по которому будет доступна документация Swagger-Ui
# /api-docs, /docs, /doc и т.п. Первый "/" обязателен
SWAGGER_PATH=/api-docs


# true чтобы включить аутентификацию HTTP BASIC для доступа к документации
SWAGGER_AUTH=false
# Имя пользователя и пароль
SWAGGER_USER=swagger
SWAGGER_PASS=1234
```

# Как приступить к работе в новом проекте
1. Установите зависимости
```bash 
$ npm i
```
2. Для запуска приложения в режиме watch (перезапуск приложения при изменении файлов) используйте команду:
```bash
$ npm run dev 
```

# Добавление конфигурации для своих модулей
Чтобы добавить конфигурацию для совего модуля, создайте файл конфигурации в директории `./src/common/config` и именем `названиеМодуля.config.ts`.

Пример `moduleName.config.ts`:
```typescript
import { ConfigType, registerAs } from '@nestjs/config';

export const moduleNameConfig = registerAs('moduleName', () => ({
  parameterName: process.env.MODULE_NAME_PARAMETER_NAME.toUpperCase() === 'TRUE',
  paramenter2Name: process.env.MODULE_NAME_PARAMETER2_NAME,
}));
export const MODULE_NAME_CONFIG_KEY = moduleNameConfig.KEY;

export type ModuleNameConfigType = ConfigType<typeof moduleNameConfig>;
```

Затем добавьте загрузку своего модуля в файле `./src/common/config/index.ts`:
```typescript
{
  ...,
  load: [appConfig, swaggerConfig, loggerConfig, moduleNameConfig]
}
```

Также вы можете добавить валидацию и значение по умолчанию для своих параметров в файле `./src/common/config/index.ts`:

```typescript
validationSchema: Joi.object({
  ...
    MODULE_NAME_PARAMETER_NAME: Joi.boolean().default(false),
    MODULE_NAME_PARAMETER2_NAME: Joi.string().default('debug'),
}
```

После этих операций вы можете использовать где угодно в проекте свои настройки.
В конструкторе класса, если он Injectable:
```typescript
constructor(@Inject(MODULE_NAME_CONFIG_KEY) private moduleNameConfig: ModuleNameConfigType)
```

Если нужно получить доступ к конфигурации вне такого класса, можно использовать такую конструкцию:
```typescript
const configService = app.get(ConfigService);
const appConfig = configService.get<ModuleNameConfigType>('moduleName');
```
Подробнее про конфигурирование можно почитать в [официальной документации](https://docs.nestjs.com/techniques/configuration).

# Предустановленные DTO, декораторы, функции и типы
## DTO 
### BaseResponseDto
`./src/common/dto/base-response.dto.ts`

Базовый ответ API. Предлагается к использованию, чтобы возвращать однотипные ответы от API.

Пример: 
```typescript
const response = new BaseResponseDto<FileDto[]>();
response.result = await this.fileService.list('content');
return response;
```

### PaginationDto
`./src/common/dto/pagination.dto.ts`

DTO, описывающий стандартный объект пагинации и интерфейс для инициализации объекта.
Все поля описаны для Swagger, при использовании будет показано описание в Swagger-Ui. 

### BaseFilterDto
`./src/common/dto/base-filter.dto.ts`

DTO для филтра (строка поиска и поле, по которому работает фильтр)
Все поля описаны для Swagger, при использовании будет показано описание в Swagger-Ui.

### BaseSortingDto
`./src/common/dto/base-filter.dto.ts`

DTO сортировки.
Все поля описаны для Swagger, при использовании будет показано описание в Swagger-Ui.

## Декораторы общего назначения
### @CurrentUser()
`./src/common/decorators/current-user.decorator.ts`

Получает текущего пользователя из объекта запроса. Используется в качестве параметра функции контроллера.
Предполагается, что ваши система авторизации и аутентификации запишет эту информацию в Request.



Пример:
```typescript
@Get('user/profile')
getProfile(@CurrentUser() user: UserDtoType) {
  const response = new BaseResponseDto<ProfileDto>();
  response.result = await this.userService.getProfile(user.id);
  return response;
}
```

## Декораторы для Swagger
### @ApiBaseResponse() 
`./src/common/decorators/swagger/api-base-response.decorator.ts`

Используется перед объявлением контроллера. Добавляет в Swagger-Ui описание ответа API.

Пример:

```typescript
@ApiBaseResponse(FileDto, { isArray: true })
@Controller()
getFiles()
{
  const response = new BaseResponseDto<FileDto[]>();
  response.result = await this.fileService.list('content');
  return response;
}
```

### @ApiPaginationResponse()
`./src/common/decorators/swagger/api-pagination-response.decorator.ts`

Используется перед объявлением контроллера, в случае, когда возвращается пагинированное значение.
Добавляет в Swagger-Ui описание ответа API.

Пример:

```typescript
@ApiPaginationResponse(PaginatedType)
@Controller()
getPaginated()
{
  const response = new BaseResponseDto<Pagination<PaginatedType>>();
  response.result = await this.paginatedTypeService.getPaginated();
  return response;
}
```

### @ApiBaseResponseOneOf()
`./src/common/decorators/swagger/api-base-response-oneof.decorator.ts`

Используется перед объявлением контроллера, в случае, когда может вернутся одно из нескольких вариантов значений.

Пример: 

```typescript
@ApiBaseResponseOneOf([UserDto, AdminDto, EditorDto])
```

### @ApiQueryPagination()
`./src/common/decorators/swagger/api-query-pagination.decorator.ts`

Используется перед объявлением контроллера, чтобы описать в документации входящие query параметры.

Пример:
```typescript
@ApiQueryPagination(UserFilterFields, UserSortingFields)
@ApiPaginationResponse(UserDto)
@Get()
async userList(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('field') field?: UserFilterFields,
  @Query('search') search?: string,
  @Query('sorting') sorting?: UserSortingFields,
  @Query('order') order?: SortingOrder,
```

### @ApiBodyOneOf
`./src/common/decorators/swagger/api-body-oneof.decorator.ts`

Используется перед объявлением контроллера, когда Request.Body может принять один из нескольких типов.

Пример:

```typescript
@ApiBodyOneOf([UpdateUserDto, UpdateDoctorDto, UpdatePatientDto])
```

## Функции
### makeError(code: ErrorCode, additional: Record<string, unknown>)
`./src/common/utils/make-error.ts`

Функция для создания типизированных ошибок.

Расширять перечень типов ошибок следует в `./src/common/enum/errors.enum.ts`

Пример:

```typescript
throw makeError(errorsEnum.FORBIDDEN, { message: 'You are not the author of this article.' });
```

### pageToSkip(page: number, limit: number): number
`./src/common/utils/page-to-skip.transform.ts`

Принимает номер страницы и лимит элементов на странице и возвращает число элементов, которое необходимо пропустить (skip)

## Pipes
Pipes используются для 2х целей:
* трансформация: привести входные данные к нужной форме или типу
* валидация: проверить входные данные, если все ок - пропустить без изменений, в противном случае вызовется исключение.

Подробнее в [официальной документации Nest JS](https://docs.nestjs.com/pipes)

### EmailPipe
`./src/common/pipes/email.pipe.ts`

Валидирует входящую строку на соответствие шаблону Email. Если строка не email - вызовет исключение.

Пример:
```typescript
async validateEmail(@Param('email', EmailPipe) email: string)
```

### PhonePipe
`./src/common/pipes/phone.pipe.ts`

Проверяет является ли входящая строка телефоном. Если нет - вызовет исключение.

Пример:
```typescript
async validatePhone(@Param('phone', ParsePhonePipe) phone: string) {
   return this.authService.validatePhone(phone);
}
```

### PagePipe
`./src/common/pipes/page.pipe.ts`

Трансформирующий Pipe. Если входящее число больше 0 - пропустит его, иначе установит равным 1.
Удобно использовать для пагинации.

Пример:
```typescript
...
async userList(
  @Query('page', PagePipe) page?: string,
...
```

### LimitPipe
`./src/common/pipes/limit.pipe.ts`

Трансформирующий Pipe. Если входящее число меньше лимита пагинации, установленного в [настройках](#настройка-пагинации) - пропустит его, иначе установит равным настроенному лимиту.
Удобно использовать для пагинации.

Пример:

```typescript
...
async userList(
  @Query('limit', LimitPipe) limit?: string,
  ...
```

# Стандартизация сообщений
Файл `./src/common/messages/index.ts` экспортирует объект messages, который содержит:
* errorMessage
* successMessage

В которых содержатся типовые сообщения при ошибке/успехе операции.

Сообщения также разбиты по файлам. Их достаточно просто изменить, дополнить или добавить новые.

Например так выглядит наполнение errorMessage:

```typescript
import { validateErrorMessage } from './validate-error.messages';
import { serverErrorMessages } from './server-error.messages';
import { authErrorMessages } from './auth-error.messages';

export const errorMessage = {
  validate: validateErrorMessage,
  server: serverErrorMessages,
  auth: authErrorMessages,
};
```

Теперь при написании кода можно делать так:

```typescript
validate(): IValidator {
    this.validateField(this.search, {
      validator: isString,
      validatorErrorMessage: errorMessage.validate.valueIsNotString('search'),
    });
```
