import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-cream">Edit Product</h1>
      <div className="mt-6">
        <ProductForm
          initialData={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            line: product.line,
            description: product.description,
            price: product.price.toString(),
            salePrice: product.salePrice?.toString() ?? "",
            featured: product.featured,
            weightGrams: product.weightGrams?.toString() ?? "",
            stock: product.stock.toString(),
            status: product.status,
            ingredients: product.ingredients ?? "",
            nutrition: product.nutrition ?? "",
            images: product.images.map((img) => ({ id: img.id, url: img.url })),
          }}
        />
      </div>
    </div>
  );
}
