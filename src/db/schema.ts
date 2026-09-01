import { pgTable, 
    pgEnum,
    uuid,
    varchar,
    integer,
    text,
    timestamp,
    boolean,
} from "drizzle-orm/pg-core";

export const shops = pgTable("shops", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    mail: text("mail").notNull().unique(),
    password: text("password").notNull(),
    phone_number: varchar("phone_number").notNull(),
    postal_code: varchar("postal_code").notNull(),
    prefecture: text("prefecture").notNull(),
    city: text("city").notNull(),
    street: text("street").notNull(),
    address_number: integer("address_number").notNull(),
    image_url: varchar("image_url").notNull(),
    is_accepted: boolean("is_accepted").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
})
export const shop_users = pgTable("shop_users", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    role: text("role").notNull(),
    status: text("status").notNull(),
})

export const menu_categories = pgTable("menu_categories", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
})

export const menus = pgTable("menus", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    description: text("description").notNull(),
    image_url: varchar("image_url").notNull(),
    is_accepted: boolean("is_accepted").notNull().default(false),
    shop_id: uuid("shop_id").references(() => shops.id),
    category_id: uuid("menu_category_id").references(() => menu_categories.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
})

export const list = pgTable("list", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    menu_id: uuid("menu_id").references(() => menus.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
})

export const side_menus = pgTable("side_menus", {
    id: uuid("id").primaryKey(),
    menu_id: uuid("menu_id").references(() => menus.id),
    list_id: uuid("list_id").references(() => list.id),
})

export const users = pgTable("users", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique(),
    password: text("password").notNull(),
    line_id: text("line_id").unique(),
    is_accepted: boolean("is_accepted").notNull().default(false),
    shop_id: uuid("shop_id").references(() => shops.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
})

export const discountTypeEnum = pgEnum("discount_type", ["percent", "amount"]);

export const discounts = pgTable("discounts", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    type: discountTypeEnum("type").notNull(),
    number: integer("number").notNull(),
    shop_id: uuid("shop_id").references(() => shops.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
})

export const orders = pgTable("orders", {
    id: uuid("id").primaryKey(),
    user_id: uuid("user_id").references(() => users.id),
    shop_id: uuid("shop_id").references(() => shops.id),
    discount_id: uuid("discount_id").references(() => discounts.id),
    order_type: text("order_type").notNull(),
    customer_number: integer("customer_number").notNull(),
    sum_price: integer("sum_price").notNull(),
    order_number: text("order_number").notNull(),
    tax: integer("tax").notNull(),
    status: text("status").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
})

export const order_menus = pgTable("order_menus", {
    id: uuid("id").primaryKey(),
    menu_id: uuid("menu_id").references(() => menus.id),
    order_id: uuid("order_id").references(() => orders.id),
    order_order_number: integer("order_order_number").notNull(),
    order_order_price: integer("order_order_price").notNull(),
})

export const payments = pgTable("payments", {
    id: uuid("id").primaryKey(),
    order_id: uuid("order_id").references(() => orders.id),
    amount: integer("amount").notNull(),
    payment_method: text("payment_method").notNull(),
    type: text("type").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
})

export const payment_pay_jpt = pgTable("payment_pay_jpt", {
    id: uuid("id").primaryKey(),
    payment_id: uuid("payment_id").references(() => payments.id),
    pay_jp_id: text("pay_jp_id").notNull(),
    payment_method: text("payment_method").notNull(),
})

export const payment_other = pgTable("payment_other", {
    id: uuid("id").primaryKey(),
    payment_id: uuid("payment_id").references(() => payments.id),
    name: text("name").notNull(),
    memo: text("memo").notNull(),
    payment_method: text("payment_method").notNull(),
})
