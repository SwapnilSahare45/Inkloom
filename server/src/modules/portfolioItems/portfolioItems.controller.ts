import type { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../shared/utils/response.js';
import {
    CreatePortfolioItemSchema,
    UpdatePortfolioItemSchema,
} from './portfolioItems.schema.js';
import {
    createPortfolioItemService,
    deletePortfolioItemService,
    getMyPortfolioItemService,
    getMyPortfolioItemsService,
    updatePortfolioItemService,
} from './portfolioItems.service.js';

export async function getMyPortfolioItemsController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const artistId = req.params.artistId as string;
        const { limit, cursor } = req.query;
        const parsedLimit = limit ? parseInt(limit as string, 10) : 10;
        const validatedLimit =
            isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;
        const result = await getMyPortfolioItemsService({
            artistId,
            limit: validatedLimit,
            cursor: cursor ? (cursor as string) : undefined,
        });
        ApiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
}

export async function getMyPortfolioItemController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { artistId, itemId } = req.params;
        const result = await getMyPortfolioItemService(
            artistId as string,
            itemId as string
        );
        ApiResponse.success(res, result);
    } catch (error) {
        next(error);
    }
}

export async function createPortfolioItemController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const artistId = req.params.artistId as string;
        const validatedInput = CreatePortfolioItemSchema.parse(req.body);
        const result = await createPortfolioItemService(
            artistId,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your portfolio item is created successfully.',
            201
        );
    } catch (error) {
        next(error);
    }
}

export async function updatePortfolioItemController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { artistId, itemId } = req.params;
        const validatedInput = UpdatePortfolioItemSchema.parse(req.body);
        const result = await updatePortfolioItemService(
            artistId as string,
            itemId as string,
            validatedInput
        );
        ApiResponse.success(
            res,
            result,
            'Your portfolio item updated successfully.'
        );
    } catch (error) {
        next(error);
    }
}

export async function deletePortfolioItemController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { artistId, itemId } = req.params;
        const result = await deletePortfolioItemService(
            artistId as string,
            itemId as string
        );
        ApiResponse.success(
            res,
            result,
            'Your portfolio item deleted successfully.'
        );
    } catch (error) {
        next(error);
    }
}
