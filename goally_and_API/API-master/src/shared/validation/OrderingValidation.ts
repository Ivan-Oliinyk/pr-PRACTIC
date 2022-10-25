import { BadRequestException } from '@nestjs/common';

interface Order {
  ordering: number;
}

export function validateOrdering<Type extends Order>(
  itemsCount: number,
  body: Array<Type>,
) {
  let ordering = 0;
  while (itemsCount > ordering) {
    if (!body.find(record => record.ordering === ordering)) {
      throw new BadRequestException(
        `requst array has missed ordering for ${ordering}`,
      );
    } else ordering++;
  }
}
