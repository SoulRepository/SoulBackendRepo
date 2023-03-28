import {
  isURL,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { LinkType } from 'entities';

export function IsValidSocialLink(
  propertyType: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isValidSocialLink',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyType],
      options: validationOptions,
      validator: {
        defaultMessage(validationArguments?: ValidationArguments): string {
          const [propertyTypeName] = validationArguments.constraints;
          const relatedValue = validationArguments.object?.[propertyTypeName];
          return `${validationArguments.property} is not valid ${relatedValue} link`;
        },
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object?.[relatedPropertyName];
          switch (relatedValue) {
            case LinkType.INSTAGRAM:
              return value.match(
                /^(https?:\/\/)(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/,
              );
            case LinkType.TWITTER:
              return value.match(
                /^(https?:\/\/)(www\.)?twitter\.com\/[a-zA-Z0-9_.]+\/?$/,
              );
            case LinkType.DISCORD:
              return value.match(
                /^(https?:\/\/)(www\.)?discord\.com\/[0-9]+\/?$/,
              );
            case LinkType.FACEBOOK:
              return value.match(
                /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-.]*\/)*([\w\-.]*)/,
              );
            case LinkType.LINKEDIN:
              return value.match(
                /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([-a-zA-Z0-9]+)\/*/gm,
              );
            case LinkType.SITE:
              return isURL(value, {
                protocols: ['http', 'https'],
              });
          }
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            value.length > relatedValue.length
          );
        },
      },
    });
  };
}
